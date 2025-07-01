// utils/ConvertSleep.js

export function convertSleepData(apiData) {
    return apiData.map(item => ({
      timestamp: new Date(item.timestamp),
      stage: item.stage
    }));
  }
  