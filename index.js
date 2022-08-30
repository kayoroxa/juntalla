const readlineSync = require('readline-sync')
const db = require('./db')
const colors = require('colors')

function app() {
  console.clear()
  console.log('\n\n')
  if (db.habits.length === 0) {
    console.log('No habits yet. Add some!'.bgRed)
    return
  }

  function getDid(habit, isYesterday) {
    if (isYesterday) {
      const todayIndex = habit.repetitions?.findIndex(
        v => v.date === new Date().toDateString()
      )

      if (habit.repetitions.length === 1 && isYesterday) return 0

      return habit.repetitions[
        todayIndex > 0 ? todayIndex - 1 : habit.repetitions.length - 1
      ]?.number
    }
    return (
      habit.repetitions?.find(v => v.date === new Date().toDateString())
        ?.number || 0
    )
  }

  const preview = db.habits.map((v, i) => {
    const diference = getDid(v) - getDid(v, true)

    let diferenceShow =
      diference > 0
        ? colors.white.bgGreen('+' + diference)
        : colors.white.bgRed(diference)

    const habitsData = ` ${i + 1} - ${colors.yellow(
      v.name
    )} - did today: ${colors.green(getDid(v))} - diference: ${diferenceShow}`

    return habitsData
  })

  const allRepetitionsToday = db.habits.reduce(
    (acc, cur) =>
      cur.repetitions.find(v => v.date === new Date().toDateString())?.number +
      acc,
    0
  )

  const indexHabit = readlineSync.question(
    `${colors.bgWhite.black(
      ' What is your habit? '
    )}\n\n   ---- All did today : ${colors.green(
      allRepetitionsToday
    )} ----\n\n${preview.join('\n')}\n\n= `
  )

  if (indexHabit === '') return

  console.clear()
  const selectedHabit = db.habits[indexHabit - 1]

  if (!selectedHabit) app()

  console.log(selectedHabit)

  console.log('\n')

  const addRepetition = readlineSync.question(
    colors.bgWhite.black(' How many repetition? ') + '\n\n= '
  )

  if (addRepetition) db.addRepetition(selectedHabit.name, addRepetition)

  console.log('\n')

  console.clear()

  app()
}

app()
