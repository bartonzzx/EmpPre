import process from 'node:process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { spawn } from 'node:child_process'
import fastify from 'fastify'
import type { MySQLPromisePool } from '@fastify/mysql'
import fastifymysql from '@fastify/mysql'
import fastifyCors from '@fastify/cors'
import dbconfig from './db_config'

// pass promise = true
declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool
  }
}

// 创建 Fastify 实例
const server = fastify({ logger: true })
server.register(fastifymysql, {
  promise: true,
  connectionString: `mysql://${dbconfig.db_user}:${dbconfig.db_pwd}@${dbconfig.db_addr}:3306/${dbconfig.db_name}`,
})

server.register(fastifyCors, {
  origin: '*', // 允许所有来源
  methods: ['GET', 'POST'], // 允许的请求方法
})

// 注册路由
// user/login 用户登录

// user/permission 获取用户权限

// user/password/edit 修改用户密码

// app/route/list 后端获取路由数据

// score_management/score 获取个人成绩
server.post('/score_management/score', async (request, reply) => {
  const db: MySQLPromisePool = server.mysql
  const { stu_id } = request.body as { stu_id: string } // Add type assertion here

  try {
    const [rows] = await db.query(
      `SELECT coursename, (CASE WHEN natureofexam = 1 THEN "正常考试" WHEN natureofexam = 0.8 THEN "重考重修" END) as natureofexam, credit, score FROM ${dbconfig.db_score} WHERE stu_id = ?`,
      [stu_id],
    )
    // 封装返回的数据格式
    const response = {
      status: 1,
      error: '',
      data: rows,
    }
    reply.send(response)
  }
  catch (err) {
    const errorResponse = {
      status: 0,
      error: err,
      data: null,
    }
    reply.send(errorResponse)
  }
})

// course_management/course 获取课程与能力对应矩阵
server.post('/course_management/course', async (request, reply) => {
  const db: MySQLPromisePool = server.mysql
  const { stu_id } = request.body as { stu_id: string } // Add type assertion here

  try {
    const [rows] = await db.query(
      `SELECT coursename,(case when re1=0 then '' when re1=0.1 then 'Low' when re1=0.3 then 'Medium' when re1=0.6 then 'High' end) as re1,(case when re2=0 then '' when re2=0.1 then 'Low' when re2=0.3 then 'Medium' when re2=0.6 then 'High' end) as re2,(case when re3=0 then '' when re3=0.1 then 'Low' when re3=0.3 then 'Medium' when re3=0.6 then 'High' end) as re3,(case when re4=0 then '' when re4=0.1 then 'Low' when re4=0.3 then 'Medium' when re4=0.6 then 'High' end) as re4,(case when re5=0 then '' when re5=0.1 then 'Low' when re5=0.3 then 'Medium' when re5=0.6 then 'High' end) as re5,(case when re6=0 then '' when re6=0.1 then 'Low' when re6=0.3 then 'Medium' when re6=0.6 then 'High' end) as re6,(case when re7=0 then '' when re7=0.1 then 'Low' when re7=0.3 then 'Medium' when re7=0.6 then 'High' end) as re7,(case when re8=0 then '' when re8=0.1 then 'Low' when re8=0.3 then 'Medium' when re8=0.6 then 'High' end) as re8,(case when re9=0 then '' when re9=0.1 then 'Low' when re9=0.3 then 'Medium' when re9=0.6 then 'High' end) as re9,(case when re10=0 then '' when re10=0.1 then 'Low' when re10=0.3 then 'Medium' when re10=0.6 then 'High' end) as re10,(case when re11=0 then '' when re11=0.1 then 'Low' when re11=0.3 then 'Medium' when re11=0.6 then 'High' end) as re11,(case when re12=0 then '' when re12=0.1 then 'Low' when re12=0.3 then 'Medium' when re12=0.6 then 'High' end) as re12,score FROM ${dbconfig.db_course} natural join ${dbconfig.db_score} WHERE stu_id = ?`,
      [stu_id],
    )
    // 封装返回的数据格式
    const response = {
      status: 1,
      error: '',
      data: rows,
    }
    reply.send(response)
  }
  catch (err) {
    const errorResponse = {
      status: 0,
      error: err,
      data: null,
    }
    reply.send(errorResponse)
  }
})

// 分页查询，暂留
// server.get('/course_management/course', async (request, reply) => {
//   const db: MySQLPromisePool = server.mysql

//   // 获取分页参数，默认值 page=1, limit=10
//   const { page = 1, limit = 10 } = request.query as { page?: number, limit?: number }
//   const offset = (page - 1) * limit

//   try {
//     // 执行分页查询
//     const [rows] = await db.query('SELECT * FROM test_course LIMIT ? OFFSET ?', [limit, offset])

//     // 获取总数
//     const [countResult] = await db.query('SELECT COUNT(*) AS total FROM test_course')
//     const total = (countResult as any)[0].total

//     // 返回分页结果
//     reply.send({
//       data: rows,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     })
//   } catch (err) {
//     reply.send(err)
//   }
// })

// employment_management/ability_evaluation/personal_ability 获取个人能力数据
server.post('/employment_management/ability_evaluation/personal_ability', async (request, reply) => {
  const db: MySQLPromisePool = server.mysql
  const { stu_id } = request.body as { stu_id: string } // Add type assertion here

  try {
    const [rows] = await db.query(
      `SELECT x1 as re1,x2 as re2,x3 as re3,x4 as re4,x5 as re5,x6 as re6,x7 as re7,x8 as re8,x9 as re9,x10 as re10,x11 as re11,x12 as re12 FROM ${dbconfig.db_ability} WHERE stu_id = ?`,
      [stu_id],
    )
    // 封装返回的数据格式
    const response = {
      status: 1,
      error: '',
      data: rows,
    }
    reply.send(response)
  }
  catch (err) {
    const errorResponse = {
      status: 0,
      error: err,
      data: null,
    }
    reply.send(errorResponse)
  }
})
// employment_management/ability_evaluation/yearly_avg_ability 获取年级能力数据
server.post('/employment_management/ability_evaluation/yearly_avg_ability', async (request, reply) => {
  const db: MySQLPromisePool = server.mysql
  const { year } = request.body as { year: number } // Add type assertion here

  try {
    const [rows] = await db.query(
      `SELECT avg_re1,avg_re2,avg_re3,avg_re4,avg_re5,avg_re6,avg_re7,avg_re8,avg_re9,avg_re10,avg_re11,avg_re12 FROM ${dbconfig.db_statistics} WHERE year = ?`,
      [year],
    )
    // 封装返回的数据格式
    const response = {
      status: 1,
      error: '',
      data: rows,
    }
    reply.send(response)
  }
  catch (err) {
    const errorResponse = {
      status: 0,
      error: err,
      data: null,
    }
    reply.send(errorResponse)
  }
})

// employment_management/ability_evaluation/yearly_ability 获取该年级能力数据
server.post('/employment_management/ability_evaluation/yearly_ability', async (request, reply) => {
  const db: MySQLPromisePool = server.mysql
  const { year } = request.body as { year: number } // Add type assertion here

  try {
    const [rows] = await db.query(
      `SELECT x1 as re1,x2 as re2,x3 as re3,x4 as re4,x5 as re5,x6 as re6,x7 as re7,x8 as re8,x9 as re9,x10 as re10,x11 as re11,x12 as re12 FROM ${dbconfig.db_ability} where stu_id like '?%'`,
      [year])
    // 封装返回的数据格式
    const response = {
      status: 1,
      error: '',
      data: rows,
    }
    reply.send(response)
  }
  catch (err) {
    const errorResponse = {
      status: 0,
      error: err,
      data: null,
    }
    reply.send(errorResponse)
  }
})

// employment_management/employment_prediction/employment 获取个人就业去向预测数据
server.post('/employment_management/employment_prediction/employment', async (request, reply) => {
  const db: MySQLPromisePool = server.mysql
  const { stu_id } = request.body as { stu_id: string } // Add type assertion here

  try {
    const [rows] = await db.query(
      `SELECT natureofunit,possibility FROM ${dbconfig.db_prediction} WHERE stu_id = ?`,
      [stu_id],
    )
    // 封装返回的数据格式
    const response = {
      status: 1,
      error: '',
      data: rows,
    }
    reply.send(response)
  }
  catch (err) {
    const errorResponse = {
      status: 0,
      error: err,
      data: null,
    }
    reply.send(errorResponse)
  }
})
// employment_management/realtime_evaluation_prediction/realtime 实时评估个人能力数据
server.post('/employment/realtime_evaluation_prediction', async (request, reply) => {
  const { pdfFilePath }: { pdfFilePath: string } = request.body as { pdfFilePath: string }

  const pythonProcess: ChildProcessWithoutNullStreams = spawn('python', ['Python\RealtimeEmploymentPrediction\RealtimePdfReader.py', pdfFilePath])

  let output: string = ''
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString()
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      reply.send({ success: true, output })
    }
    else {
      reply.status(500).send({ success: false, message: 'Python script failed' })
    }
  })
})

// employment_management/realtime_evaluation_prediction/realtime 实时预测个人就业去向

// 启动服务器
async function start() {
  try {
    await server.listen(3000, '0.0.0.0')
    server.log.info(`Server is running at http://localhost:3000`)
  }
  catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
