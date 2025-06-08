// 存储管理 API
// 重新导出 lib/api/storage 中的函数以保持 API 结构一致性

export {
    getStorageOverviewStats,
    getStorageTypesDistribution,
    getStorageNodes,
    getStoragePerformanceData,
    getBuckets,
    getObjects,
    getLifecyclePolicies
} from '@/lib/api/storage' 