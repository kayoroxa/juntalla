const fs = require('fs')
const joinPath = require('path').join

const path = joinPath(__dirname, './db-habits.json')

function db() {
  const fileExists = fs.existsSync(path)
  const habits = fileExists ? require(path) : []

  if (!fileExists) {
    fs.writeFileSync(path, JSON.stringify(habits))
  }

  function addHabit(habit) {
    habits.push(habit)
  }

  function save() {
    fs.writeFileSync(path, JSON.stringify(habits, null, 2))
  }

  function addRepetition(name, number) {
    const isNumber = isNaN(number) === false

    if (!isNumber) {
      console.log('Invalid number')
      return
    }

    const habit = habits.find(v => v.name === name)

    if (!habit.repetitions) habit.repetitions = []

    const findDate = habit.repetitions.find(
      v => v.date === new Date().toDateString()
    )

    number = parseInt(number)

    if (!findDate) {
      habit.repetitions.push({ date: new Date().toDateString(), number })
    } else {
      if (!findDate.number) findDate.number = 0
      findDate.number += number
    }

    save()
  }

  return {
    addHabit,
    get habits() {
      return habits
    },
    addRepetition,
  }
}

module.exports = db()
