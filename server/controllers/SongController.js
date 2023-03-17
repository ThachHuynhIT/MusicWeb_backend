const Song = require("../models/Song");
const Singer = require("../models/Singer");
const Album = require("../models/Album");
const { multipleMongooseToObject } = require("../util/mongoose");
const { mongooseToObject } = require("../util/mongoose");
const slugify = require("slugify");

class SongController {
  index(req, res, next) {
    Promise.all([Song.find({}), Song.countDocumentsDeleted()])
      .then(([song, deletedCount]) =>
        res.render("./songs/song", {
          deletedCount,
          song: multipleMongooseToObject(song),
        })
      )
      .catch(next);
  }

  // song/:slug [GET]
  show(req, res, next) {
    Song.findOne({ slug: req.params.slug })
      .then((song) =>
        res.render("./songs/show", { song: mongooseToObject(song) })
      )
      .catch(next);
  }

  // song/create [GET]
  create(req, res, next) {
    Promise.all([Singer.find({}), Album.find()])
      .then(([singer, album]) =>
        res.render("./songs/create", {
          album: multipleMongooseToObject(album),
          singer: multipleMongooseToObject(singer),
        })
      )
      .catch(next);
  }
  // [POST] song/store
  store(req, res, next) {
    const song = new Song(req.body);
    song
      .save()
      .then(() => res.redirect("/admin/song"))
      .catch(next);
  }

  // song/edit/:id [GET]
  edit(req, res, next) {
    Song.findOne({ _id: req.params.id })
      .then((song) => {
        res.render("./songs/edit", {
          song: mongooseToObject(song),
        });
      })
      .catch(next);
  }

  update(req, res, next) {
    Song.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/admin/song"))
      .catch(next);
  }

  // [DELETE] /song/:id
  destroy(req, res, next) {
    Song.delete({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [DELETE] /song/force/:id
  forceDestroy(req, res, next) {
    Song.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [GET] /song/bin
  songBin(req, res, next) {
    Song.findDeleted({})
      .then((song) => {
        res.render("./songs/bin", {
          song: multipleMongooseToObject(song),
        });
      })
      .catch(next);
  }

  // [PATCH] song/restore/:id
  restore(req, res, next) {
    Song.restore({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [POST] song/handle-form-action
  handleFormAction(req, res, next) {
    switch (req.body.actionName) {
      case "delete":
        Song.delete({ _id: { $in: req.body.albumIDs } })
          .then(() => res.redirect("back"))
          .catch(next);
        break;
      default:
        res.json({ message: "Sai" });
    }
  }
}

module.exports = new SongController();
