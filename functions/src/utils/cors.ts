import {Response} from "express";

/**
 * Set CORS headers for the response
 * @param {Response} response Express response object
 */
export function setCorsHeaders(response: Response) {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type");
}
