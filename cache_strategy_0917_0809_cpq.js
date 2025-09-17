// 代码生成时间: 2025-09-17 08:09:18
// Import Meteor's built-in packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store cache data
const CacheCollection = new Mongo.Collection('cacheCollection');

/**
 * A function to set cache with an expiration time.
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} expiry - The expiry time in seconds
 */
export const setCache = (key, value, expiry) => {
  // Ensure the key is a string
  check(key, String);
  // Ensure the expiry is a number
  check(expiry, Number);

  // Create a cache document with the value and expiry time
  const cacheDocument = {
    key: key,
    value: value,
    expiry: new Date(new Date().getTime() + expiry * 1000),
  };

  // Insert the cache document into the collection
  CacheCollection.upsert({ key: key }, cacheDocument, {
    // If the document already exists, update the value and expiry
    $set: { value: value, expiry: new Date(new Date().getTime() + expiry * 1000) },
  });
};

/**
 * A function to get cache by key.
 * @param {string} key - The cache key
 * @returns {any} The cached value or null if not found or expired
 */
export const getCache = (key) => {
  // Ensure the key is a string
  check(key, String);

  // Find the cache document by key
  const cacheDocument = CacheCollection.findOne({ key: key });

  // Check if the cache document exists and has not expired
  if (cacheDocument && new Date() < cacheDocument.expiry) {
    // Return the cached value
    return cacheDocument.value;
  } else {
    // Return null if not found or expired
    return null;
  }
};

/**
 * A function to clear cache by key.
 * @param {string} key - The cache key
 */
export const clearCache = (key) => {
  // Ensure the key is a string
  check(key, String);

  // Remove the cache document by key
  CacheCollection.remove({ key: key });
};

/**
 * A function to clear all cache.
 */
export const clearAllCache = () => {
  // Remove all cache documents
  CacheCollection.remove({});
};
