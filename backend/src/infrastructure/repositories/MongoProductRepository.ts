import type { IProductRepository } from "../../domain/repositories/IProductRepository.js";
import type {
  Product,
  ProductFilters,
  PaginatedProducts,
} from "../../domain/entities/Product.js";
import { ProductModel } from "../database/models/ProductModel.js";

export class MongoProductRepository implements IProductRepository {
  async findAll(filters: ProductFilters): Promise<PaginatedProducts> {
    const {
      category,
      minPrice,
      maxPrice,
      sort,
      q,
      page = 1,
      limit = 12,
    } = filters;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query["variants.price"] = {};
      if (minPrice !== undefined)
        (query["variants.price"] as Record<string, number>).$gte = minPrice;
      if (maxPrice !== undefined)
        (query["variants.price"] as Record<string, number>).$lte = maxPrice;
    }

    if (q) {
      query.$text = { $search: q };
    }

    // Sort mapping
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price_asc":
        sortOption = { "variants.price": 1 };
        break;
      case "price_desc":
        sortOption = { "variants.price": -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
    }

    const [products, total] = await Promise.all([
      ProductModel.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(query),
    ]);

    return {
      products: products.map(this.toEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await ProductModel.findOne({ slug }).lean();
    return product ? this.toEntity(product) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await ProductModel.findById(id).lean();
    return product ? this.toEntity(product) : null;
  }

  async create(
    data: Omit<Product, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    const product = await ProductModel.create(data);
    return this.toEntity(
      product.toObject() as unknown as Record<string, unknown>,
    );
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const product = await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    return product ? this.toEntity(product) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Atomic stock decrement using findOneAndUpdate with $inc.
   * The stock >= quantity condition in the query ensures we never go negative.
   * If another checkout already depleted stock, this returns null → oversell prevented.
   */
  async decrementStock(
    productId: string,
    variantSku: string,
    quantity: number,
  ): Promise<boolean> {
    const result = await ProductModel.findOneAndUpdate(
      {
        _id: productId,
        variants: {
          $elemMatch: {
            sku: variantSku,
            stock: { $gte: quantity },
          },
        },
      },
      {
        $inc: { "variants.$.stock": -quantity },
      },
      { new: true },
    );

    return !!result;
  }

  private toEntity(doc: unknown): Product {
    const d = doc as Record<string, unknown>;
    return {
      _id: (d._id as object)?.toString(),
      name: d.name as string,
      slug: d.slug as string,
      description: d.description as string,
      images: (d.images as string[]) || [],
      category: d.category as string,
      brand: d.brand as string | undefined,
      variants: (
        d.variants as Array<{
          _id?: object;
          sku: string;
          size?: string;
          colour?: string;
          price: number;
          stock: number;
        }>
      ).map((v) => ({
        _id: v._id?.toString(),
        sku: v.sku,
        size: v.size,
        colour: v.colour,
        price: v.price,
        stock: v.stock,
      })),
      tags: (d.tags as string[]) || [],
      createdAt: d.createdAt as Date,
      updatedAt: d.updatedAt as Date,
    };
  }
}
