/**
 * 批量添加和修改front matter ，需要配置 ./config.yml 文件。
 */
import fs from "fs";// 文件模块
import path from "path";// 路径模块
import matter from "gray-matter";// front matter解析器 https://github.com/jonschlinkert/gray-matter
import jsonToYaml from "json2yaml";
import yamlToJs from "yamljs";
import inquirer from "inquirer";// 命令行操作
import chalk from "chalk";// 命令行打印美化
import { readFileList } from "./readFileList.mjs";
import { type, repairDate } from "./fn.mjs";
import { fileURLToPath } from 'url'

const log = console.log

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, 'config.yml') // 配置文件的路径

main()

/**
 * 主体函数
 */
async function main() {
  const promptList = [
    {
      type: 'confirm',
      message: chalk.yellow('批量操作frontmatter有修改数据的风险，确定要继续吗？'),
      name: 'edit'
    }
  ]
  let edit = true

  await inquirer.prompt(promptList).then(answers => {
    edit = answers.edit
  })

  if (!edit) {
    // 退出操作
    return
  }

  const config = yamlToJs.load(configPath) // 解析配置文件的数据转为js对象

  if (type(config.path) !== 'array') {
    log(chalk.red('路径配置有误，path字段应该是一个数组'))
    return
  }

  if (config.path[0] !== 'source') {
    log(chalk.red("路径配置有误，path数组的第一个成员必须是'source'"))
    return
  }

  const filePath = path.join(__dirname, '..', ...config.path) // 要批量修改的文件路径
  const files = readFileList(filePath) // 读取所有md文件数据

  files.forEach(file => {
    log(chalk.green(`updating file: ${file.filePath} `))
    let dataStr = fs.readFileSync(file.filePath, 'utf8') // 读取每个md文件的内容
    const fileMatterObj = matter(dataStr) // 解析md文件的front Matter。 fileMatterObj => {content:'剔除frontmatter后的文件内容字符串', data:{<frontmatter对象>}, ...}
    let matterData = fileMatterObj.data // 得到md文件的front Matter

    let mark = false
    // 删除操作
    if (config.delete) {
      if (type(config.delete) !== 'array') {
        log(chalk.yellow('未能完成删除操作，delete字段的值应该是一个数组！'))
      } else {
        config.delete.forEach(item => {
          if (matterData[item]) {
            delete matterData[item]
            mark = true
          }
        })
      }
    }

    // 添加、修改操作
    if (type(config.data) === 'object') {
      Object.assign(matterData, config.data) // 将配置数据合并到front Matter对象
      mark = true
    }

    // 有操作时才继续
    if (mark) {
      if (matterData.date && type(matterData.date) === 'date') {
        matterData.date = repairDate(matterData.date) // 修复时间格式
      }
      const newData =
        jsonToYaml
          .stringify(matterData)
          .replace(/\n\s{2}/g, '\n')
          .replace(/"/g, '') +
        '---\r\n' +
        fileMatterObj.content
      fs.writeFileSync(file.filePath, newData) // 写入
      log(chalk.green(`update frontmatter：${file.filePath} `))
    }
  })
}
