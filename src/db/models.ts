import { model, Schema } from 'mongoose'

const itemSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    bought: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

export type ItemDocument = {
  _id: Schema.Types.ObjectId
  name: string
  bought?: boolean
  created_at: Date
  updated_at: Date
}

export type ItemCreate = Pick<ItemDocument, 'name'>
export type ItemUpdate = Partial<
  Omit<ItemDocument, '_id' | 'created_at' | 'updated_at'>
>

export const Item = model<ItemDocument>('Item', itemSchema)
