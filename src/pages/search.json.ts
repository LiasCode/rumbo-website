import type { APIRoute } from 'astro';
import { searchIndex } from '../documents';

export const GET: APIRoute = async () => Response.json(await searchIndex());
