const Album = require("../models/Album");
const Song = require("../models/Song");
const Singer = require("../models/Singer");
const { multipleMongooseToObject } = require("../util/mongoose");
const { mongooseToObject } = require("../util/mongoose");
const slugify = require("slugify");

class AlbumController {
  index(req, res, next) {
    Promise.all([Album.find({}), Album.countDocumentsDeleted()])
      .then(([album, deletedCount]) =>
        res.render("./albums/albums", {
          deletedCount,
          album: multipleMongooseToObject(album),
        })
      )
      .catch(next);
  }

  // album/:slug [GET]
  show(req, res, next) {
    Album.findOne({ _id: req.params.id })
      .then((album) => {
        var albumName = album.name;
        Song.find({ album: albumName }).then((song) => {
          res.render("./albums/show", {
            song: multipleMongooseToObject(song),
            album: mongooseToObject(album),
          });
        });
      })
      .catch(next);
  }

  // album/create [GET]
  create(req, res, next) {
    Singer.find({}).then((singer) => {
      res.render("./albums/create", {
        singer: multipleMongooseToObject(singer),
      });
    });
  }

  // [POST] album/store
  store(req, res, next) {
    const album = new Album(req.body);
    album
      .save()
      .then(() => res.redirect("/admin/album"))
      .catch((error) => {});
  }

  // album/edit/:id [GET]
  edit(req, res, next) {
    Album.findOne({ _id: req.params.id })
      .then((album) => {
        res.render("./albums/edit", {
          album: mongooseToObject(album),
        });
      })
      .catch(next);
  }

  // [PUT] album/:slug
  update(req, res, next) {
    const formData = req.body;
    formData.slug = slugify(formData.name, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
      strict: true,
      locale: "vi",
    });
    //update course after adding image, slug
    Album.updateOne({ _id: req.params.id }, formData)
      .then(() => res.redirect("/album"))
      .catch(next);
  }

  // [DELETE] /album/:id
  destroy(req, res, next) {
    Album.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [DELETE] /album/force/:id
  forceDestroy(req, res, next) {
    Album.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [GET] /album/bin
  albumBin(req, res, next) {
    Album.findDeleted({})
      .then((album) => {
        res.render("./albums/bin", {
          album: multipleMongooseToObject(album),
        });
      })
      .catch(next);
  }

  // [PATCH] album/restore/:id
  restore(req, res, next) {
    Album.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [POST] album/handle-form-action
  handleFormAction(req, res, next) {
    switch (req.body.actionName) {
      case "delete":
        Album.delete({ _id: { $in: req.body.albumIDs } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Sai" });
    }
  }

  // res.json(req.body)
}

module.exports = new AlbumController();
