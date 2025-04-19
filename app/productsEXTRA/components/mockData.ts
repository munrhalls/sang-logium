/**
 * Mock data for the standalone Products page
 * This would be replaced with actual data fetching in a real implementation
 */

import { Product } from '@/sanity.types';

// Mock filter options
export const mockFilterOptions = [
  {
    name: 'brand',
    type: 'multiselect',
    filterCategory: 'regular',
    options: ['AudioTech', 'SoundMaster', 'BeatWave', 'Melodix', 'ToneKraft']
  },
  {
    name: 'price',
    type: 'range',
    filterCategory: 'regular',
    min: 0,
    max: 1000,
    step: 10
  },
  {
    name: 'inStock',
    type: 'checkbox',
    filterCategory: 'regular'
  },
  {
    name: 'type',
    type: 'multiselect',
    filterCategory: 'specification',
    options: ['Over-ear', 'In-ear', 'On-ear', 'Wireless', 'Wired']
  }
];

// Mock sort options
export const mockSortOptions = [
  {
    name: 'price',
    displayName: 'Price',
    type: 'numeric',
    field: 'price',
    defaultDirection: 'asc'
  },
  {
    name: 'name',
    displayName: 'Name',
    type: 'alphabetic',
    field: 'name',
    defaultDirection: 'asc'
  },
  {
    name: 'createdAt',
    displayName: 'Newest',
    type: 'date',
    field: '_createdAt',
    defaultDirection: 'desc'
  }
];

// Mock product data
export const mockProducts: Partial<Product>[] = Array.from({ length: 12 }, (_, i) => ({
  _id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  brand: ['AudioTech', 'SoundMaster', 'BeatWave', 'Melodix', 'ToneKraft'][Math.floor(Math.random() * 5)],
  price: Math.floor(Math.random() * 500) + 50,
  stock: Math.random() > 0.2 ? Math.floor(Math.random() * 100) + 1 : 0,
  image: {
    asset: {
      _ref: `image-${i + 1}`,
      _type: 'reference'
    }
  },
  description: [
    {
      _type: 'block',
      _key: `desc-${i}`,
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: `span-${i}`,
          text: `This is a mock description for product ${i + 1}. It would contain detailed information about the product in a real implementation.`
        }
      ]
    }
  ],
  categoryPath: ['audio', 'headphones']
}));