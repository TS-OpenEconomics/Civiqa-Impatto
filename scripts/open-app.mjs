import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import http from 'node:http'
import net from 'node:net'

const host = 'localhost'
const basePath = '/Civiqa-Impatto/'
const port = await findFreePort(5173)
const url = `http://${host}:${port}${basePath}`

const args = ['--prefix', 'app', 'run', 'dev', '--', '--host', host, '--port', String(port), '--strictPort']

const command = process.platform === 'win32' ? 'cmd.exe' : 'npm'
const commandArgs =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', `npm ${args.join(' ')}`]
    : args

const devServer = spawn(command, commandArgs, {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
})

openWhenReady(url)

devServer.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 0)
})

process.on('SIGINT', () => devServer.kill('SIGINT'))
process.on('SIGTERM', () => devServer.kill('SIGTERM'))

function findFreePort(startPort) {
  return new Promise((resolve) => {
    function tryPort(candidate) {
      const server = net.createServer()

      server.once('error', () => tryPort(candidate + 1))
      server.once('listening', () => {
        server.close(() => resolve(candidate))
      })
      server.listen(candidate, host)
    }

    tryPort(startPort)
  })
}

function openWhenReady(targetUrl) {
  const startedAt = Date.now()
  const timeoutMs = 30_000

  function check() {
    const request = http.get(targetUrl, (response) => {
      response.resume()
      openEdge(targetUrl)
    })

    request.on('error', () => {
      if (Date.now() - startedAt < timeoutMs) {
        setTimeout(check, 300)
      }
    })
    request.setTimeout(1000, () => {
      request.destroy()
    })
  }

  check()
}

function openEdge(targetUrl) {
  console.log(`Opening Edge: ${targetUrl}`)

  if (process.platform === 'win32') {
    const edgePaths = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ]
    const edgePath = edgePaths.find((candidate) => existsSync(candidate))

    if (edgePath) {
      spawn(edgePath, [targetUrl], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      }).unref()
      return
    }

    spawn('cmd.exe', ['/d', '/s', '/c', `start "" microsoft-edge:"${targetUrl}"`], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    }).unref()
    return
  }

  const opener = process.platform === 'darwin' ? 'open' : 'xdg-open'
  spawn(opener, [targetUrl], {
    detached: true,
    stdio: 'ignore',
  }).unref()
}
