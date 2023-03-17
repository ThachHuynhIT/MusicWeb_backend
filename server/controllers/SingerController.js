const Singer = require("../models/Singer");
const { multipleMongooseToObject } = require("../util/mongoose");
const { mongooseToObject } = require("../util/mongoose");
const slugify = require("slugify");
const Resize = require("../middlewares/Resize");
const path = require("path");
require("dotenv").config();

class SingerController {
  index(req, res, next) {
    Promise.all([Singer.find({}), Singer.countDocumentsDeleted()])
      .then(([singer, deletedCount]) =>
        res.render("./singers/singer", {
          deletedCount,
          singer: multipleMongooseToObject(singer),
        })
      )
      .catch(next);
  }

  // singer/:slug [GET]
  show(req, res, next) {
    Singer.findOne({ slug: req.params.slug })
      .then((singer) =>
        res.render("./singers/show", { singer: mongooseToObject(singer) })
      )
      .catch(next);
  }

  // singer/create [GET]
  create(req, res, next) {
    res.render("./singers/create");
  }

  // [POST] singer/store
  store(req, res, next) {
    req.body.views = 0;
    const singer = new Singer(req.body);
    singer
      .save()
      .then(() => res.redirect("/admin/singer"))
      .catch((error) => {});
  }

  // singer/edit/:id [GET]
  edit(req, res, next) {
    Singer.findOne({ _id: req.params.id })
      .then((singer) => {
        res.render("./singers/edit", {
          singer: mongooseToObject(singer),
        });
      })
      .catch(next);
  }

  update(req, res, next) {
    Singer.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/admin/singer"))
      .catch(next);
  }

  // [DELETE] /singer/:id
  destroy(req, res, next) {
    Singer.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [DELETE] /singer/force/:id
  forceDestroy(req, res, next) {
    Singer.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [GET] /singer/bin
  singerBin(req, res, next) {
    Singer.findDeleted({})
      .then((singer) => {
        res.render("./singers/bin", {
          singer: multipleMongooseToObject(singer),
        });
      })
      .catch(next);
  }

  // [PATCH] singer/restore/:id
  restore(req, res, next) {
    Singer.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [POST] singer/handle-form-action
  handleFormAction(req, res, next) {
    switch (req.body.actionName) {
      case "delete":
        Singer.delete({ _id: { $in: req.body.albumIDs } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Sai" });
    }
  }

  uploadImage = async (req, res, next) => {
    const imagePath = path.join("test/public/img");
    const fileUpload = new Resize(imagePath);
    const id = req.params.id;

    if (req.file) {
      const filename = await fileUpload.save(req.file.buffer);
      const img = path.join(process.env.LOCAL_STATIC_STORE + filename);
      Singer.updateOne({ _id: id }, { img: img })
        .then((singer) => res.send(singer))
        .catch(next);
    } else {
      res.send("lỗi");
    }
  };
}

module.exports = new SingerController();
