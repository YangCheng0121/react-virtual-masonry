// 使用 Unsplash Source API 生成随机图片
// 这是一个免费的图片服务,适合用于演示

export interface ImageData {
  id: number;
  width: number;
  height: number;
  url: string;
  title: string;
  author: string;
  [key: string]: any;
}

// 预定义的图片尺寸比例,让布局更加真实
const aspectRatios = [
  { width: 400, height: 600 }, // 竖图 2:3
  { width: 600, height: 400 }, // 横图 3:2
  { width: 500, height: 500 }, // 方图 1:1
  { width: 800, height: 600 }, // 横图 4:3
  { width: 600, height: 800 }, // 竖图 3:4
  { width: 700, height: 500 }, // 横图 7:5
  { width: 500, height: 700 }, // 竖图 5:7
  { width: 900, height: 600 }, // 横图 3:2
  { width: 600, height: 900 }, // 竖图 2:3
  { width: 1000, height: 667 }, // 横图 3:2
];

// 图片主题分类
const categories = [
  'nature',
  'architecture',
  'food',
  'travel',
  'animals',
  'technology',
  'people',
  'art',
  'fashion',
  'sports',
];

// 摄影师名字
const photographers = [
  'Alex Johnson',
  'Maria Garcia',
  'Chen Wei',
  'Sarah Miller',
  'David Brown',
  'Emma Wilson',
  'James Taylor',
  'Lisa Anderson',
  'Michael Lee',
  'Sophie Martin',
];

/**
 * 生成模拟图片数据
 * @param page 页码
 * @param pageSize 每页数量
 * @returns 图片数据数组
 */
export function generateImageData(page: number, pageSize: number): ImageData[] {
  const data: ImageData[] = [];
  const startIndex = (page - 1) * pageSize;

  for (let i = 0; i < pageSize; i++) {
    const id = startIndex + i;
    const ratio = aspectRatios[id % aspectRatios.length];
    const category = categories[id % categories.length];
    const photographer = photographers[id % photographers.length];

    // 使用 Picsum Photos 作为图片源 (更稳定的免费图片服务)
    // 格式: https://picsum.photos/seed/{seed}/{width}/{height}
    const seed = id + 1000; // 使用 seed 确保图片可重复
    const url = `https://picsum.photos/seed/${seed}/${ratio.width}/${ratio.height}`;

    data.push({
      id,
      width: ratio.width,
      height: ratio.height,
      url,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Photo ${id}`,
      author: photographer,
    });
  }

  return data;
}

/**
 * 模拟异步加载图片数据
 * @param page 页码
 * @param pageSize 每页数量
 * @param maxPages 最大页数
 * @returns Promise 包含数据和是否有更多数据
 */
export async function loadImageData(
  page: number,
  pageSize: number,
  maxPages: number = 10
): Promise<{ data: ImageData[]; hasMore: boolean }> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = generateImageData(page, pageSize);
  const hasMore = page < maxPages;

  return { data, hasMore };
}
