import mongoose from 'mongoose'

const clickSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  originalUrl: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  referer: { type: String },
  timestamp: { type: Date, default: Date.now }
})

const Click = mongoose.model('Click', clickSchema)
export default Click