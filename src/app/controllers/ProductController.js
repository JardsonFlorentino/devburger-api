import * as Yup from 'yup'
import fs from 'node:fs/promises'
import pathModule from 'node:path'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import User from '../models/User.js'

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { filename: path } = request.file
    const { name, price, category_id, offer } = request.body

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
      offer,
    })

    return response.status(201).json({ product })
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { id } = request.params

    const findProduct = await Product.findByPk(id)

    if (!findProduct) {
      return response
        .status(400)
        .json({ error: 'Make sure your product ID is correct' })
    }

    let path
    if (request.file) {
      path = request.file.filename
    }

    const { name, price, category_id, offer } = request.body

    await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },
      {
        where: {
          id,
        },
      }
    )

    return response.status(200).json()
  }

  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    const appUrl = process.env.APP_URL || ''
    const uploadsDir = pathModule.resolve(process.cwd(), 'uploads')

    // build a map of filenames in uploads for quick lookup
    let uploadFiles = []
    try {
      uploadFiles = await fs.readdir(uploadsDir)
    } catch (e) {
      // ignore, uploads may be empty in some environments
      uploadFiles = []
    }

    const normalize = (s = '') =>
      s
        .toString()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const safe = await Promise.all(
      products.map(async (p) => {
        const plain = p.get({ plain: true })

        if (plain.path) {
          return {
            ...plain,
            url: `${appUrl}/product-file/${plain.path}`,
          }
        }

        // try to find a matching file in uploads by product name
        const slug = normalize(plain.name)
        const match = uploadFiles.find((f) => normalize(f).includes(slug))

        if (match) {
          return {
            ...plain,
            url: `${appUrl}/product-file/${match}`,
          }
        }

        // fallback to assets default
        return {
          ...plain,
          url: `${appUrl}/assets/default.jpg`,
        }
      })
    )

    return response.json(safe)
  }
}

export default new ProductController()
