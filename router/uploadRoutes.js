const express = require("express")
const multer = require("multer")
const path = require("path")
const parseUrlFriendly = require("../utils/parseUrlFriendly")

const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/images/")
  },
  filename(req, file, cb) {
    cb(
      null,
      `${parseUrlFriendly(
        file.originalname.split(".")[0]
      )}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extName = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = filetypes.test(file.mimetype)

  if (extName && mimeType) {
    return cb(null, true)
  } else {
    cb("Images only!")
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`)
})

module.exports = router
