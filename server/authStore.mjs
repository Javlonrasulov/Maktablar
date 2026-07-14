import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAuthHandlers, DEFAULT_ADMIN } from './authCore.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const USERS_FILE = path.join(DATA_DIR, 'system-users.json')

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([DEFAULT_ADMIN], null, 2), 'utf8')
  }
}

async function readUsers() {
  ensureData()
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [DEFAULT_ADMIN]
  } catch {
    return [DEFAULT_ADMIN]
  }
}

async function writeUsers(users) {
  ensureData()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

const handlers = createAuthHandlers({ readUsers, writeUsers })

export const listSystemUsers = handlers.listSystemUsers
export const createSystemUser = handlers.createSystemUser
export const updateSystemUser = handlers.updateSystemUser
export const deleteSystemUser = handlers.deleteSystemUser
export const loginWithCredentials = handlers.loginWithCredentials
