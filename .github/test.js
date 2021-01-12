const fs = require('fs')
const { join } = require('path')
const { execSync } = require('child_process')

const DIR = '_test'

const [install, version, source="file:.."] = process.argv.slice(2)

isVue2 = version === '2'

if (fs.existsSync(DIR))
  fs.rmSync(DIR, {recursive: true})

fs.mkdirSync(DIR)
fs.writeFileSync(join(DIR, 'package.json'), '{}', 'utf-8')

execSync(`${install} ${isVue2 ? 'vue@2 @vue/composition-api' : 'vue@3' }`, { cwd: DIR, stdio: 'inherit' })
execSync(`${install} vue-demi@${source}`, { cwd: DIR, stdio: 'inherit' })

const cjs = fs.readFileSync(join(DIR, 'node_modules/vue-demi/lib/index.cjs.js'), 'utf-8')

if (cjs.includes(`exports.isVue2 = ${isVue2}`)) {
  process.exit(0)
} else {
  console.log(cjs)
  process.exit(1)
}