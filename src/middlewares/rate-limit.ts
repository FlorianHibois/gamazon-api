import rateLimit, { MemoryStore, RateLimitRequestHandler } from "express-rate-limit";
import { ClientCode } from "../utils/status-code-http";

export class RateLimit
{

	public static loginLimiter: RateLimitRequestHandler = rateLimit({
		windowMs       : 10 * 60 * 1000,
		statusCode     : ClientCode.TOO_MANY_REQUESTS,
		max            : 5,
		message        : {
			message: "Too many login attempts. Please try again in ten minutes.",
		},
		standardHeaders: true,
		legacyHeaders  : false,
		store          : new MemoryStore(),
	});

	public static signUpLimiter: RateLimitRequestHandler = rateLimit({
		windowMs       : 60 * 60 * 1000,
		max            : 5,
		statusCode     : ClientCode.TOO_MANY_REQUESTS,
		message        : {
			message: "Too many signing up attempts. Please try again in one hour.",
		},
		standardHeaders: true,
		legacyHeaders  : false,
		store          : new MemoryStore(),
	});
}
