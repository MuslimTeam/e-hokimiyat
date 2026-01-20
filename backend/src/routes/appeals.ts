import { Router } from 'express'
import { appeals, AppealStatus, AppealPriority, AppealCategory } from '../data'

const router = Router()

// Get all appeals with filtering
router.get('/', (req, res) => {
  const { 
    search, 
    status, 
    category, 
    priority, 
    district,
    page = 1, 
    limit = 10 
  } = req.query

  let filteredAppeals = [...appeals]

  // Apply filters
  if (search) {
    const searchLower = (search as string).toLowerCase()
    filteredAppeals = filteredAppeals.filter(appeal =>
      appeal.title.toLowerCase().includes(searchLower) ||
      appeal.applicant.toLowerCase().includes(searchLower) ||
      appeal.content.toLowerCase().includes(searchLower)
    )
  }

  if (status && status !== 'all') {
    filteredAppeals = filteredAppeals.filter(appeal => appeal.status === status)
  }

  if (category && category !== 'all') {
    filteredAppeals = filteredAppeals.filter(appeal => appeal.category === category)
  }

  if (priority && priority !== 'all') {
    filteredAppeals = filteredAppeals.filter(appeal => appeal.priority === priority)
  }

  if (district && district !== 'all') {
    filteredAppeals = filteredAppeals.filter(appeal => appeal.district === district)
  }

  // Pagination
  const total = filteredAppeals.length
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedAppeals = filteredAppeals.slice(startIndex, endIndex)

  res.json({
    data: paginatedAppeals,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  })
})

// Get single appeal by ID
router.get('/:id', (req, res) => {
  const appeal = appeals.find(a => a.id === req.params.id)
  
  if (!appeal) {
    return res.status(404).json({ error: 'Appeal not found' })
  }

  res.json(appeal)
})

// Get appeal statistics
router.get('/stats/summary', (req, res) => {
  const total = appeals.length
  const pending = appeals.filter(a => a.status === AppealStatus.KUTILMOQDA).length
  const inProgress = appeals.filter(a => a.status === AppealStatus.JARAYONDA).length
  const resolved = appeals.filter(a => a.status === AppealStatus.HAL_ETILGAN).length

  res.json({
    total,
    pending,
    inProgress,
    resolved
  })
})

// Get appeal options (for filters)
router.get('/options/lists', (req, res) => {
  const statusLabels = {
    [AppealStatus.KUTILMOQDA]: 'Кутилмоқда',
    [AppealStatus.JARAYONDA]: 'Жараёнда',
    [AppealStatus.HAL_ETILGAN]: 'Ҳал этилган'
  }

  const priorityLabels = {
    [AppealPriority.PAST]: 'Паст',
    [AppealPriority.ORTA]: 'Ўрта',
    [AppealPriority.YUQORI]: 'Юқори'
  }

  const categoryLabels = {
    [AppealCategory.IS_BILAN_TA_MINLASH]: 'Иш билан таъминлаш',
    [AppealCategory.TA_LIM]: 'Таълим',
    [AppealCategory.INFRASTRUKTURA]: 'Инфраструктура',
    [AppealCategory.SOG_LIQNI_SAQLASH]: 'Соғлиқни сақлаш',
    [AppealCategory.IJTIMOIY]: 'Ижтимоий',
    [AppealCategory.KOMMUNAL_XIZMATLAR]: 'Коммуналь хизматлар',
    [AppealCategory.BOSHQA]: 'Бошқа'
  }

  const districts = [
    { id: '1', name: 'Тошкент шаҳри' },
    { id: '2', name: 'Самарқанд вилояти' },
    { id: '3', name: 'Бухоро вилояти' }
  ]

  res.json({
    status: statusLabels,
    priority: priorityLabels,
    category: categoryLabels,
    districts
  })
})

export default router
