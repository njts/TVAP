const express = require("express");
const request = require("request-promise-native");
const helmet = require('helmet');
const cache = require("memory-cache");
const fs = require("fs");
const app = express();

// API settings
const key = process.env.KEY;
const site_id = process.env.SITE_ID;
const base = process.env.BASE;
const cacheExpire = 300 * 1000; // 5 minutes
const logFile = "logs/app.log";

// Telegram settings (optional)
const sendToTelegram = process.env.SEND_TO_TELEGRAM || false;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const telegramToken = process.env.TELEGRAM_TOKEN;

// Get tomorrow's date
const today = new Date();
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
const tomorrowDate = tomorrow.toISOString().slice(0, 10);

let logMemory = [];

const log = (logMessage) => {
  logMemory.push(`[${new Date().toISOString()}] ${logMessage}\n`);
};

app.use(helmet());

app.use((req, res, next) => {
  // Allow requests from any origin
  res.header("Access-Control-Allow-Origin", "*");
  // Allow specified headers in the request
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Only allow GET requests to /visitors
  if (req.method !== "GET" || req.url !== "/visitors") {
    log(`[Invalid Request] - Method: ${req.method} - URL: ${req.url}`);
    return res.status(405).send("Method not allowed");
  }

  // Log valid request
  log(`[Valid Request] - Method: ${req.method} - URL: ${req.url}`);
  next();
});

// Send logs to Telegram
const sendLogsToTelegram = (logs) => {
  if (!sendToTelegram || !telegramChatId || !telegramToken) {
    return;
  }

  const options = {
    method: "POST",
    url: `https://api.telegram.org/bot${telegramToken}/sendMessage`,
    form: {
      chat_id: telegramChatId,
      text: logs.join("\n")
    }
  };

  request(options, (error, response) => {
    if (error) {
      console.log(`Error sending logs to Telegram: ${error}`);
    } else {
      console.log(`Logs sent to Telegram: ${response.body}`);
    }
  });
};

app.get("/visitors", async (req, res) => {
  let data = cache.get("data");
  if (data) {
    const start = Date.now();
    log(`[Cached data sent to client] - Execution time: ${Date.now() - start}ms`);
    res.json({ data: { results: { visitors: { value: data } } }, cache: true });
  } else {
    try {
      const start = Date.now();
      const url = new URL(`http://${base}`);
      url.pathname = '/api/v1/stats/aggregate';
      url.searchParams.append('site_id', site_id);
      url.searchParams.append('period', 'custom');
      url.searchParams.append('date', `2022-01-01,${tomorrowDate}`);
      url.searchParams.append('metrics', 'visitors');
      const urlString = url.toString();
      const body = await request({
        url: urlString,
        headers: {
          Authorization: `Bearer ${key}`,
        },
        json: true
      });
      if (
        !body.results ||
        !body.results.visitors ||
        !body.results.visitors.value
      ) {
        throw new Error("Incorrect data format");
      }
      cache.put("data", body.results.visitors.value, cacheExpire);
      log(`[Data sent to client] - Execution time: ${Date.now() - start}ms`);
      res.json({ data: body, cache: false });
    } catch (err) {
      log(`Error getting data from API: ${err}`);
      return res.status(500).send("Internal Server Error");
    }
  }
  // Send logs to Telegram if there are any and clear log memory array after sending.
  if (logMemory.length > 0) {
    sendMemoryLogsToTelegram();
    fs.appendFile(logFile, logMemory.join(""), (err) => {
      if (err) {
        console.log("Error writing to log file");
      } else {
        console.log("Log written to file");
        logMemory = [];
      }
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
