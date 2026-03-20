'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sql = queryInterface.sequelize

    // Atenção: faça backup do banco ANTES de rodar esta migration em produção.
    // A migration tenta converter users.id -> UUID e atualizar orders.userId quando possível.

    await sql.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`)

    // 1) adicionar coluna temporária uuid
    await sql.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS id_uuid UUID;`)

    // 2) popular id_uuid para linhas existentes
    await sql.query(`UPDATE users SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;`)

    // 3) tentar atualizar referências na tabela orders (vários formatos possíveis)
    await sql.query(`DO $$
    BEGIN
      -- se existir coluna "userId" em orders
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='userId') THEN
        BEGIN
          ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id_uuid UUID;
          UPDATE orders SET user_id_uuid = u.id_uuid FROM users u WHERE orders."userId"::text = u.id::text;
          ALTER TABLE orders DROP COLUMN IF EXISTS "userId";
          ALTER TABLE orders RENAME COLUMN user_id_uuid TO "userId";
        END;
      END IF;

      -- se existir coluna userId (case-insensitive)
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND lower(column_name)='userid') THEN
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id_uuid') THEN
            ALTER TABLE orders ADD COLUMN user_id_uuid UUID;
          END IF;
          -- try update by casting
          UPDATE orders SET user_id_uuid = u.id_uuid FROM users u WHERE orders.userId::text = u.id::text;
          ALTER TABLE orders DROP COLUMN IF EXISTS userId;
          ALTER TABLE orders RENAME COLUMN user_id_uuid TO userId;
        END;
      END IF;
    END$$;`)

    // 4) trocar as colunas na users: manter coluna antiga como backup, renomear id_uuid -> id
    // Drop primary key constraint, renomear colunas, criar PK uuid
    await sql.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;`)
    await sql.query(`ALTER TABLE users RENAME COLUMN id TO id_old;`)
    await sql.query(`ALTER TABLE users RENAME COLUMN id_uuid TO id;`)
    await sql.query(`ALTER TABLE users ALTER COLUMN id SET NOT NULL;`)
    await sql.query(`ALTER TABLE users ADD PRIMARY KEY (id);`)

    // Nota: colunas FK em outras tabelas precisam já ter sido atualizadas para referenciar UUIDs.
  },

  async down(queryInterface, Sequelize) {
    const sql = queryInterface.sequelize

    // Reverter: tenta restaurar id_old -> id
    await sql.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;`)
    await sql.query(`ALTER TABLE users RENAME COLUMN id TO id_uuid_temp;`)
    await sql.query(`ALTER TABLE users RENAME COLUMN id_old TO id;`)
    await sql.query(`ALTER TABLE users RENAME COLUMN id_uuid_temp TO id_uuid;`)
    await sql.query(`ALTER TABLE users DROP COLUMN IF EXISTS id_uuid;`)
    await sql.query(`ALTER TABLE users ADD PRIMARY KEY (id);`)
  },
}
