import express from 'express'
import { getOverview } from '../controllers/admin.controller'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { authorizeadmin } from '~/middlewares/auth.middlewares'

const router = express.Router()

// Lấy dữ liệu tổng quan
router.get('/overview', accessTokenValidator, authorizeadmin, getOverview)

export default router
