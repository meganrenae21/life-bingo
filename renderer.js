// use the array bingoTasks for tasks when they are on the board; when a new card is generated, the bingoTasks array resets (all current items removed from array) and tasks are added to array based on the card just generated. Cards are not saved unless saved manually. The save process includes making a copy of the bingoTasks array into a new document using NeDB which is stored in the bingoCards datastore.

const uuid = require("uuid-random");
// uuid is used for bingo cards

const shortid = require("shortid");
// shortid is used for task ids

const electron = require("electron");

const Datastore = require("nedb");

const userLists = new Datastore({
  filename: "data/userLists.db",
  autoload: true
});

const activeTasks = new Datastore({
  filename: "data/activeTasks.db",
  autoload: true
});

const bingoCards = new Datastore({
  filename: "data/bingoCards.db",
  autoload: true
});

const swal = require("sweetalert");
var toPlay = [];
var card = {};
var bingoTasks = [];

var ColB = new Array(5);
var ColI = new Array(5);
var ColN = new Array(4);
var ColG = new Array(5);
var ColO = new Array(5);
var Row1 = new Array(5);
var Row2 = new Array(5);
var Row3 = new Array(4);
var Row4 = new Array(5);
var Row5 = new Array(5);
var DownDiag = new Array(4);
var UpDiag = new Array(4);

var gameCard = [];

var allBingos = [];

gameID = "";

$(document).ready(function() {
  $("#saveListBtn").click(function() {
    var tags = $("#listTags").val();
    var listName = $("#listName").val();
    var userList = {};

    userList.name = listName;
    userList.tags = tags;
    userList.tasks = [];

    userLists.insert(userList, function(err, newDoc) {
      if (err) {
        console.log(err);
      } else {
        console.log(userLists);
      }
    });

    $("#listTags").tagsinput("removeAll");
    $("#listName").val("");
  });
  $("#taskFormBtn").click(function() {
    var options = "";
    userLists.find({}, function(err, docs) {
      if (err) {
        console.log("Error!");
      } else {
        for (var i = 0; i < docs.length; i++) {
          options +=
            '<option value="' +
            docs[i].name +
            '">' +
            docs[i].name +
            "</option>";
        }
        $("#selectList").html(options);
      }
    });
  });
  $("#saveTaskBtn").click(function() {
    var assignedList = $("#selectList").val();
    var task = $("#taskinput").val();
    var taskid = shortid.generate();
    userLists.update(
      { name: assignedList },
      { $addToSet: { tasks: { task: task, id: taskid } } },
      {}
    );
    $("#taskinput").val("");
  });
  $("#optionsFormBtn").click(function() {
    var checkboxes = "";
    userLists.find({}, function(err, docs) {
      if (err) {
        console.log("Error!");
      } else {
        for (var i = 0; i < docs.length; i++) {
          checkboxes +=
            '<input type="checkbox" class="optioncheck" id="' +
            docs[i].name +
            '"><label for="' +
            docs[i].name +
            '">' +
            docs[i].name +
            "</label><br/>";
        }
        $("#listOptions").html(checkboxes);
      }
    });
  });
  $("#saveSettingsBtn").click(function() {
    var retval = [];
    var nonchecked = [];
    userLists.find({}, function(err, docs) {
      if (err) {
        console.log(err);
      } else {
        $(".optioncheck:checked").each(function() {
          retval.push($(this).attr("id"));
        });
        for (var m = 0; m < retval.length; m++) {
          userLists.update({ name: retval[m] }, { $set: { active: true } });
        }
        $(".optioncheck:not(:checked)").each(function() {
          nonchecked.push($(this).attr("id"));
        });
        for (var n = 0; n < nonchecked.length; n++) {
          userLists.update(
            { name: nonchecked[n] },
            { $set: { active: false } }
          );
        }
        $("#optionsForm").modal("hide");
      }
    });
  });
  $("#viewListsBtn").click(function() {
    $("#viewListsContent").html("");
    userLists.find({}, function(err, docs) {
      if (err) {
        console.log(err);
      } else {
        for (i = 0; i < docs.length; i++) {
          var taskitems = "";
          var innerList = "";
          var innerCard = "";
          var accordionBtn = "";
          accordionBtn =
            '<div class="card"><div class="card-header"><h2 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#list' +
            docs[i]._id +
            '"aria-expanded="false" aria-controls="list' +
            docs[i]._id +
            '">' +
            docs[i].name +
            "</button></h2></div>";
          var innerList = '<div class="collapse" id="list' + docs[i]._id + '">';
          var innerCard =
            '<div class="card-body" id="tasks' + docs[i]._id + '">';
          docs[i]["tasks"].forEach(function(item) {
            taskitems +=
              '<div class="d-flex justify-content-between border-bottom"><div class="task_item text-center w-75 my-1" id="' +
              item.id + '">' +
              item.task +
              '</div><span class="dlsp badge bg-danger text-white my-1 pt-1" data-delete="' + item.id + '" onclick="deleteTask()">delete</span></div>';
          });
          $("#viewListsContent").append(
            accordionBtn + innerList + innerCard + taskitems + "</div></div>"
          );
        }
      }
    });
  });
  $("#generateCard").click(function() {
    $(".squareSpan").addClass("btn-outline-primary");
    $(".squareSpan").removeClass("btn-primary");
    $("#freespace").addClass("btn-primary");
    bingoTasks = [];
    activeTasks.remove({}, { multi: true });
    userLists.find({ active: true }, function(err, docs) {
      var arr = [];
      for (i = 0; i < docs.length; i++) {
        for (t = 0; t < docs[i].tasks.length; t++) {
          arr.push(docs[i].tasks[t]);
        }
      }
      console.log(arr);
      if (arr.length > 23) {
        for (n = 0; n < arr.length; n++) {
          activeTasks.insert({ task: arr[n] });
        }
        activeTasks.find({}, function(err, docs) {
          var unusedTasks = [];
          var usedTasks = [];
          for (m = 0; m < docs.length; m++) {
            unusedTasks.push(docs[m].task);
          }
          for (x = 0, y = 24; x < 24; x++, y--) {
            var w = Math.floor(Math.random() * y);
            document.getElementById("span" + (x + 1)).innerText =
              unusedTasks[w].task;
            usedTasks.push(unusedTasks[w]);
            unusedTasks.splice(w, 1);
          }
          for (z = 0; z < 24; z++) {
            var cardTask = {
              Task: usedTasks[z].task,
              Position: "span" + (z + 1),
              Completed: false,
              Id: usedTasks[z].id
            };
            bingoTasks.push(cardTask);
          }
          gameID = uuid();
          card = {
            Tasks: bingoTasks,
            bingos: 0,
            blackout: false
          };
          updateCard();
          gameCard.forEach(function(array) {
            toPlay.push(array);
          });
          console.log(gameCard);
          console.log(toPlay);
        });
      } else {
        alert("You must have 24 tasks to create a card");
      }
    });
  });
  $(".squareSpan").click(function() {
    var span_pos = $(this).attr("id");
    var index = bingoTasks.findIndex(t => t.Position == span_pos);
    bingoTasks[index].Completed = !bingoTasks[index].Completed;
    if (bingoTasks[index].Completed == true) {
      $(this).removeClass("btn-outline-primary");
      $(this).addClass("btn-primary");
      console.log(gameCard);
    } else if (bingoTasks[index].Completed == false) {
      $(this).removeClass("btn-primary");
      $(this).addClass("btn-outline-primary");
    }
    updateCard();

    for (c = 0; c < toPlay.length; c++) {
      var chk = toPlay[c].includes(bingoTasks[index].Completed);
      if (chk == true) {
        var chktrue = arr => arr.every(v => v === true);
        if (chktrue(toPlay[c]) === true) {
          card.bingos += 1;
          allBingos.push(toPlay[c]);
          toPlay.splice(c, 1);
          swal("BINGO!", "Well done!");
        }
      }
    }

    if (bingoTasks[index].Completed == false) {
      for (d = 0; d < allBingos.length; d++) {
        var unchk = allBingos[d].includes(bingoTasks[index].Completed);
        if (unchk == true) {
          var filtarr = allBingos[d].filter(
            x => x !== bingoTasks[index].Completed
          );
          var unbingo = arr => arr.every(y => y === true);
          if (unbingo(filtarr) === true) {
            card.bingos -= 1;
            toPlay.push(allBingos[d]);
            allBingos.splice(d, 1);
          }
        }
      }
    }

    var chkblckout = arr => arr.every(z => z.Completed == true);
    if (chkblckout(bingoTasks) === true) {
      card.blackout = true;
      swal("BLACKOUT!", "Congrats! You conquered the mountain lion!");
    }
    if (chkblckout(bingoTasks) === false) {
      card.blackout = false;
    }

    console.log(gameCard);
    console.log(card);
    console.log(allBingos);
  });
  $("#saveCardBtn").click(function() {
    var taskArr = new Array();
    var card_Title = $("#cardName").val();
    var card_Tags = $("#cardTags").val();
    for (var s = 0; s < bingoTasks.length; s++) {
      taskArr.push({
        Task: bingoTasks[s].Task,
        Position: bingoTasks[s].Position,
        Completed: bingoTasks[s].Completed,
        ID: bingoTasks[s].Id
      });
    }
    bingoCards.update(
      { Query_ID: gameID },
      {
        $set: {
          Title: card_Title,
          Tags: card_Tags,
          Tasks: taskArr,
          Bingos: card.bingos,
          Blackout: card.blackout
        }
      },
      {
        upsert: true
      }
    );
    bingoCards.persistence.compactDatafile;
    $("#saveModal").modal("hide");
  });
});
$("#viewCards").on("shown.bs.modal", function() {
  // get title for each saved card
  // get tags
  // get the number of tasks that have been completed
  bingoCards.find({}, function(err, docs) {
    for (i = 0; i < docs.length; i++) {
      var title = docs[i].Title;
      var tags = docs[i].Tags;
      var tagstd = "";
      var blackout = docs[i].Blackout;
      var bingos = docs[i].Bingos;
      var tasks = docs[i].Tasks;
      var completedTasks = 0;
      for (h = 0; h < tasks.length; h++) {
        var completed = tasks[h].Completed;
        if (completed === true) {
          completedTasks += 1;
        }
      }
      for (var u = 0; u < tags.length; u++) {
        tagstd += "<span><small>| " + tags[u] + " |</small></span>";
      }

      $("#cardList").append(
        "<tr><th scope='row'><button type='button' class='btn btn-secondary btn-sm' onClick='loadCard(this)' id='" +
          docs[i]._id +
          "'>" +
          title +
          "</button></th><td>" +
          tagstd +
          "</td><td>" +
          completedTasks +
          "</td><td>" +
          bingos +
          "</td><td>" +
          blackout +
          "</td></tr>"
      );
    }
  });
});
$("#viewCards").on("hidden.bs.modal", function() {
  $("#cardList").html("");
});

function updateCard() {
  ColB[0] = bingoTasks[0].Completed;
  ColB[1] = bingoTasks[5].Completed;
  ColB[2] = bingoTasks[10].Completed;
  ColB[3] = bingoTasks[14].Completed;
  ColB[4] = bingoTasks[19].Completed;
  gameCard[0] = ColB;

  ColI[0] = bingoTasks[1].Completed;
  ColI[1] = bingoTasks[6].Completed;
  ColI[2] = bingoTasks[11].Completed;
  ColI[3] = bingoTasks[15].Completed;
  ColI[4] = bingoTasks[20].Completed;
  gameCard[1] = ColI;

  ColN[0] = bingoTasks[2].Completed;
  ColN[1] = bingoTasks[7].Completed;
  ColN[2] = bingoTasks[16].Completed;
  ColN[3] = bingoTasks[21].Completed;
  gameCard[2] = ColN;

  ColG[0] = bingoTasks[3].Completed;
  ColG[1] = bingoTasks[8].Completed;
  ColG[2] = bingoTasks[12].Completed;
  ColG[3] = bingoTasks[17].Completed;
  ColG[4] = bingoTasks[22].Completed;
  gameCard[3] = ColG;

  ColO[0] = bingoTasks[4].Completed;
  ColO[1] = bingoTasks[9].Completed;
  ColO[2] = bingoTasks[13].Completed;
  ColO[3] = bingoTasks[18].Completed;
  ColO[4] = bingoTasks[23].Completed;
  gameCard[4] = ColO;

  Row1[0] = bingoTasks[0].Completed;
  Row1[1] = bingoTasks[1].Completed;
  Row1[2] = bingoTasks[2].Completed;
  Row1[3] = bingoTasks[3].Completed;
  Row1[4] = bingoTasks[4].Completed;
  gameCard[5] = Row1;

  Row2[0] = bingoTasks[5].Completed;
  Row2[1] = bingoTasks[6].Completed;
  Row2[2] = bingoTasks[7].Completed;
  Row2[3] = bingoTasks[8].Completed;
  Row2[4] = bingoTasks[9].Completed;
  gameCard[6] = Row2;

  Row3[0] = bingoTasks[10].Completed;
  Row3[1] = bingoTasks[11].Completed;
  Row3[2] = bingoTasks[12].Completed;
  Row3[3] = bingoTasks[13].Completed;
  gameCard[7] = Row3;

  Row4[0] = bingoTasks[14].Completed;
  Row4[1] = bingoTasks[15].Completed;
  Row4[2] = bingoTasks[16].Completed;
  Row4[3] = bingoTasks[17].Completed;
  Row4[4] = bingoTasks[18].Completed;
  gameCard[8] = Row4;

  Row5[0] = bingoTasks[19].Completed;
  Row5[1] = bingoTasks[20].Completed;
  Row5[2] = bingoTasks[21].Completed;
  Row5[3] = bingoTasks[22].Completed;
  Row5[4] = bingoTasks[23].Completed;
  gameCard[9] = Row5;

  DownDiag[0] = bingoTasks[0].Completed;
  DownDiag[1] = bingoTasks[6].Completed;
  DownDiag[2] = bingoTasks[17].Completed;
  DownDiag[3] = bingoTasks[23].Completed;
  gameCard[10] = DownDiag;

  UpDiag[0] = bingoTasks[19].Completed;
  UpDiag[1] = bingoTasks[15].Completed;
  UpDiag[2] = bingoTasks[8].Completed;
  UpDiag[3] = bingoTasks[4].Completed;
  gameCard[11] = UpDiag;
}

function loadCard(e) {
  var elem_id = e.getAttribute("id");
  bingoTasks.length = 0;
  card = {};
  toPlay = [];
  bingoCards.findOne({ _id: elem_id }, function(err, doc) {
    gameID = doc.Query_ID;
    for (var v = 0; v < doc.Tasks.length; v++) {
      var position = doc.Tasks[v].Position;
      document.getElementById(position).innerText = doc.Tasks[v].Task;
      if (doc.Tasks[v].Completed == true) {
        document.getElementById(position).classList.add("btn-primary");
        document
          .getElementById(position)
          .classList.remove("btn-outline-primary");
      } else if (doc.Tasks[v].Completed == false) {
        document.getElementById(position).classList.add("btn-outline-primary");
        document.getElementById(position).classList.remove("btn-primary");
      }
      document.getElementById("freespace").classList.add("btn-primary");
      bingoTasks.push(doc.Tasks[v]);
    }
    updateCard();
    $("#cardName").val(doc.Title);
    for (var n = 0; n < doc.Tags.length; n++) {
      $("#cardTags").tagsinput("add", doc.Tags[n]);
    }
    $("#viewCards").modal("hide");
    card = {
      Tasks: bingoTasks,
      bingos: doc.Bingos,
      blackout: doc.Blackout
    };
    gameCard.forEach(function(array) {
      var tpl = toPlay.length;
      toPlay[tpl] = array;
    });
    console.log(bingoTasks);
    console.log(gameCard);
    console.log(toPlay);
    console.log(card);
  });
}

var taskID;
function deleteTask() {
  var doc_id;
  var e = event.target;
  taskID = e.dataset.delete;
  var tsk = e.parentNode;
  tsk.parentNode.removeChild(tsk);
  userLists.find({}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      for (var j = 0; j < docs[i].tasks.length; j++) {
        if (docs[i].tasks[j].id == taskID) {
          doc_id = docs[i]._id;
          finishDelete(doc_id)
          break;
        }
      }
    }
  });
}

function finishDelete(did) {
  var arr = [];
    userLists.findOne({ _id: did }, function(err, doc) {
      for (var k = 0; k < doc.tasks.length; k++) {
        if (doc.tasks[k].id !== taskID) {
          arr.push(doc.tasks[k]);
        }
      }
      userLists.update({ _id: did }, { $set: { tasks: arr } });
      userLists.persistence.compactDatafile;
    });
}
