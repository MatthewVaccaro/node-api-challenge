const express = require("express");
const pm = require("../data/helpers/projectModel");
const am = require("../data/helpers/actionModel");

const router = express.Router();

//Get All
router.get("/", (req, res) => {
  pm.get()
    .then(obj => {
      return res.status(200).json(obj);
    })
    .catch(error => {
      console.log(error);
    });
});

//Get By ID
router.get("/:id", validateId(), (req, res) => {
  res.status(200).json(req.user);
});

//Post New Project
router.post("/", validateBody(), (req, res) => {
  pm.insert(req.body)
    .then(newProject => {
      res.status(201).json(newProject);
    })
    .catch(error => {
      console.log(error);
    });
});

//Delete a Project
router.delete("/:id", validateId(), (req, res) => {
  pm.get(req.params.id)
    .then(user => {
      const foundUser = user;
      pm.remove(req.params.id)
        .then(user => {
          res.status(200).json(foundUser);
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
});

//Edit a Project
router.put("/:id", validateId(), validateBodyOnPost(), (req, res) => {
  pm.update(req.params.id, req.body)
    .then(edited => {
      res.status(200).json(edited);
    })
    .catch(error => {
      console.log(error);
    });
});

//Get Action By ID
router.get("/:id/actions", validateId(), (req, res) => {
  pm.getProjectActions(req.params.id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      console.log(error);
    });
});

//Add Action to a project
router.post("/:id/actions", validateBodyOnPost(), validateId(), (req, res) => {
  const action = { ...req.body, project_id: req.params.id };
  am.insert(action)
    .then(newAction => {
      res.status(201).json(newAction);
    })
    .catch(error => {
      console.log(error);
    });
});

//Delete an Action
router.delete("/:id/actions/:actID", (req, res) => {
  am.remove(req.params.actID)
    .then(removedAction => {
      res.status(200).json(removedAction);
    })
    .catch(error => {
      console.log(error);
    });
});

//Edit Action
router.put("/:id/actions/:actID", (req, res) => {
  const id = req.params.actID;
  const changes = req.body;
  am.update(id, changes)
    .then(edit => {
      res.status(201).json(edit);
    })
    .catch(error => {
      console.log(error);
    });
});

//middleware

function validateBody() {
  return (req, res, next) => {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: "missing a body" });
    } else {
      next();
    }
  };
}

function validateBodyOnPost() {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({ message: "missing a body" });
    } else {
      next();
    }
  };
}

function validateId() {
  return (req, res, next) => {
    pm.get(req.params.id).then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "We couldn't find that!" });
      }
    });
  };
}
module.exports = router;
