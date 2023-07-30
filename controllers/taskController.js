const Task = require("../model/Task");
const User = require("../model/User");
const transporter = require("../config/nodemailer.js");
require("dotenv").config();

const QRCode = require("qrcode");

const { datesAreOnSameDay } = require("../utils/taskReset");

const getUserTasks = async (req, res) => {
  const result = await Task.find({ owner: req.user });

  console.log(req.user);
  if (!result) return res.status(204).json({ message: "No tasks found" });

  const checkStreak = async (task) => {
    if (task.lastChecked === undefined) {
      return;
    }
    const today = new Date();
    const lastCheckedPlusOne = task.lastChecked;
    lastCheckedPlusOne.add(1, "days");
    if (
      datesAreOnSameDay(today, task.lastChecked) ||
      datesAreOnSameDay(today, lastCheckedPlusOne) // Last checked is
    ) {
      return;
    } else {
      try {
        const bbb = await Task.findByIdAndUpdate(task._id, { streak: 0 });
      } catch (err) {
        alert(err + "ERROR CHECKING STREAK");
      }
    }
  };
  result.forEach(checkStreak);
  return res.json(result);
};

const changeTaskName = async (req, res) => {
  try {
    console.log(req.taskName);
    const bbb = await Task.findByIdAndUpdate(req.params.taskId, {
      taskName: req.body.taskName,
    });
    console.log(bbb);
    return res.status(201).json({ success: "NAME CHANGED" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const bbb = await Task.findByIdAndDelete(req.params.taskId);
    console.log(bbb);
    return res.status(204).json({ message: "TASK DELETED" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const checkTask = async (req, res) => {
  const myTask = await Task.find({ _id: req.params.taskId });
  const today = new Date();
  const myStreak = myTask[0].streak;

  try {
    const bbb = await Task.findByIdAndUpdate(req.params.taskId, {
      streak: myStreak + 1,
      LastChecked: today,
    });
    console.log(bbb);
  } catch (err) {
    console.log(err);
  }

  return res.status(201).json({ success: "Task checked off" });
};

const createNewTask = async (req, res) => {
  const { taskName, timed, startTime, endTime } = req.body;

  if (!taskName) {
    return res.status(400).json({ message: "Task name required" });
  } else {
    try {
      const result = await Task.create({
        taskName: taskName,
        streak: 0,
        owner: req.user,
        LastChecked: null,
      });
      console.log(result);

      return res.status(201).json({ success: `New Task has been created!` });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};

const sendQRCodeEmail = async (req, res) => {
  try {
    myLink = process.env.SERVERHOST_URL + "task/" + req.params.taskId;
    myTask = await Task.findOne({ _id: req.params.taskId });
    console.log(myTask);
    QRCode.toFile(
      `./qrCodes/${req.params.taskId}.png`,
      myLink,
      {
        errorCorrectionLevel: "H",
      },
      function (err) {
        if (err) throw err;
        console.log("QR CODE SAVED");
      }
    );
    var mailOptions = {
      from: "rhewsoncodes@gmail.com",
      to: "rhewsoncodes@gmail.com",
      subject: `Your QR Code for Task ${myTask.taskName}`,
      html: `<img src = "http://${process.env.SERVERHOST_URL}:${process.env.PORT}/qrCodes/${req.params.taskId}.png"/>`,
      attachments: [
        {
          filename: `${req.params.taskId}.png`,
          path: `./qrCodes/${req.params.taskId}.png`,
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("EMAIL SENT");
      }
    });

    return res.status(201).json({ success: "NOTHING WENT WRONG" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createNewTask,
  getUserTasks,
  checkTask,
  changeTaskName,
  deleteTask,
  sendQRCodeEmail,
};
