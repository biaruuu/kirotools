import mongoose, { Schema, Document } from 'mongoose'

export interface IRequestCount extends Document {
  tool: string
  count: number
  updatedAt: Date
}

const RequestCountSchema = new Schema<IRequestCount>({
  tool:      { type: String, required: true, unique: true, index: true },
  count:     { type: Number, default: 0 },
  updatedAt: { type: Date, default: () => new Date() },
})

export const RequestCount =
  (mongoose.models.RequestCount as mongoose.Model<IRequestCount>) ||
  mongoose.model<IRequestCount>('RequestCount', RequestCountSchema)
