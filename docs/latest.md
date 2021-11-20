# Programming Documentation

## Data Stores

**Note:** *Life Bingo* uses [nedb](https://github.com/louischatriot/nedb) to create save data locally. Please refer to nedb's documentation for more information on the available methods and functions.

| Name | Path | Description |
|------|-------|------|
| activeTasks | `data/activeTasks.db` | contains every task belonging to an active list (the lists from which cards are made). deleted and regenerated each time a new card is created. unstable -- performing operations on this data is not recommended. |
| bingoCards| `data/bingoCards.db` | list of all saved bingo cards |
| userLists| `data/bingoCards.db` | of all lists and their tasks |

## Data Structure

### bingoCards

| Name | Type | Required | Duplicable | Description |
|------|------|----------|-------------|------------|
| Query_ID | string | Yes | No | A [version 4 (random) universally unique identifier (UUID)](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)), used to retrieve specific cards. During the runtime, the Query_ID exists in a `gameID` instance. |
| `Title` | string | No | Yes | the Title of the card. May be an empty string. |
| `Tags` | array | No | Yes | array of strings which hold tags, or keywords, for the card |
| Tasks | array | Yes | Yes | array of objects for each task on the card. |
| `Tasks[n].Task` | string | Yes | Yes | the name or description of the task, where `n` is the index of the object within the `Tasks` array  |
| `Tasks[n].Position` | string | Yes | No | the ID of the HTML `<span>` element giving the position of the task on the card, where `n` is the index of the object within the `Tasks` array |
| `Tasks[n].Completed` | boolean | Yes | Yes | set to `true` when the card has been checked (task completed), `false` when not checked, where `n` is the index of the object within the `Tasks` array |
| `Tasks[n].ID` | string | Yes | No | a random value to assign each task a unique id, where `n` is the index of the object within the `Tasks` array |
 `Bingos`| integer | Yes | Yes | the number of solved bingos on a card |
 | `Blackout` | boolean | Yes | Yes | set to `true` if all tasks on a card have been completed, otherwise `false` |
 | `_id` | string | Yes | No | a unique id auto-generated under the hood |

### userLists

 | Name | Type | Required | Duplicable | Description |
 |------|------|----------|------------|-------------|
 | `name` | string | yes | no | the list title |
 | `tags` | array | no | yes | list tags, array of strings |
 | `tasks` | array | no | no | array of each task object in the list |
 | `tasks[n].task` | string | yes | yes | the description of the task, where `n` is the index of the object within the `tasks` array |
 | `tasks[n].id` | string | yes | no | a unique id given to each task | 
 | `_id` | string | yes | no | a unique id auto-generated under the hood |

### activeTasks 

 | Name | Type | Required | Duplicable | Description | 
 |------|------|----------|------------|-------------|
 | `task` | object | yes | no | the object containing each task |
 | `task.task` | string | yes | yes | the description of name of the task |
 | `task.id` | string | yes | no | a unique id for each task |
 | `_id` | string | yes | no | a unique id auto-generated under the hood for each instance of the `task` object |

## Global structure

### gameCard

An **array** of each column, row, and diagonal on the current card.
*[ColB, ColI, ColN, ColG, ColO, Row1, Row2, Row3, Row4, Row5, DownDiag, UpDiag]*

Each element in the array is an array of **booleans** indicating if a particular space has been completed or not.

All element arrays (ColB, ColI, etc...) have 5 boolean elements with the exception of *ColN*, *Row3*, *DownDiag*, and *UpDiag*, which have 4 due to the free space given in the middle of the card.

*Example*

If your card has B2 and B4 completed, while B1, B3, and B5 are open, then the *ColB* array would be:

*[false, true, false, true, false]*

### toPlay

An **array** of all the elements (rows, columns, and diagonals) from the **gameCard** object that have NOT been fully completed.

To begin with, the *toPlay* object is identical to the *gameCard* object. When a Bingo is achieved, that element is removed from the *toPlay* array.

### card

An **object** that houses information on the current/active card, with three values:

1. *Tasks* - array taken from the *bingTasks* array
2. *bingos* - number of completed bingos on the card
3. *blackout* - boolean indicating whether every space has been checked on the current card

### bingoTasks

An **array** of each task on the current card, with information on the position of the task on the card, whether it's been completed, and it's ID. 

Each element is an object with the following values:

- *Task* - the actual task, which displays on the card. Taken from the *activeTasks* data store.
- *Position* - the ID of the DOM element for the grid space to which the task is assigned
- *Completed* - boolean value indicating whether or not the task has been completed
- *Id* - unique id for the task. Taken from the *activeTasks* data store.

### gameID

The UUID that is assigned to the current card. When the card is saved to the *bingoCards* data store, this will become the card's *Query_ID*. When the card is loaded to the current session, the card's stored *Query_ID* becomes the *gameID*.

## Life Cycle

### New List Created

 1. Local instances generated:
 
    - `tags`: string; user generated input 
    - `listName`: array of strings; user generated input
    - `userList`: object generated in local scope
        - `.name`: from `listName`
        - `.tags`: from `tags`

 2. Global object saved
    - `userList` saved to `userLists` data store

### New Task(s)

 1. `userLists` retrieved for user input dropdown

 2. Local instances generated:
    - `assignedList`: string, selected list name from input field (comes directly from `userLists[n].name` where `n` is the index value of the list in the `userLists` data store)
    - `task`: string, task description from user input field
    - `taskid`: string, randomly generated ID

 3. Data store query:
    - Query: `assignedList`
    - Database: `userLists`
    - Queried field: `Name`

 4. Global object updated and stored
    - Update to `userLists[q].tasks` where `q` is the index of the queried list in the `userLists` store:
        - `.task`: from `task`
        - `.id`: from `taskid`

### Creating the Active List Form

 1. Retrieve and iterate through all objects in the `userLists` store
    - For each object iteration, new HTML elements created under the form element `#listOptions`
        - `input` element attributes:
            - `type`: checkbox
            - `id`: from `userLists[i].name` where `i` is the iteration number (starting at zero)
            - `class`: `optioncheck`
        - `label` element:
            - `for` attribute: `userLists[i].name`, where `i` is the iteration number (starting at zero)
            - text content is the same as the `for` attribute and the `id` of the checkbox it labels

### Activating Lists

 1. Function-local arrays initiated
    - `retval`
    - `nonchecked`

 2. `userLists` data store retrieved

 2. Iterate through each `input` element with the `optioncheck` class
    - If the `input` element is not checked, push element `id` to `nonchecked` array
    - If the `input` element is checked, push element `id` to `retval` array

 3. Iterate through function-local arrays to set the `active` property of matching `userLists` object
    - Match string in array with `userLists[i]` object `name` property
    - For the `retval` array, set the matching object's `active` property to `true`
    - For the `nonchecked` array, set the matching object's `active` property to `false`

### Generating a Card

 1. Local array `bingoTasks` initiated

 2. `activeTasks` data store emptied

 3. `userLists` data store queried to find objects with `active` set to `true`

 4. Query-local array `arr` initiated

 5. `userLists`  query results from Step 3 iterated through to retrieve `userLists[i].tasks` array of each result (where `i` is the iteration)

 6. `userLists[i].tasks` iterated through to retrieve `userLists[i].tasks[t]` and push the value of `t` to the `arr` array

 *Note: Steps 5 and 6 repeat until all tasks of all queried `userLists` objects have been pushed to `arr`*

 7. Check if there are at least 24 objects in `arr` array
      - If there are fewer than 24 objects in `arr` array, alert user "You must have 24 tasks to create a card", sequence stopped (do not proceed to step 8)
      - If there are 24 or more objects in `arr` array, proceed to step 8

 8. Push each item in `arr` array to `activeTasks` data store

 9. Prepare to iterate through `activeTasks` data store and create new empty local arrays
      - `unusedTasks`
      - `usedTasks`

 10. Iterate through `activeTasks` store, pushing `activeTasks[i].task` to `unusedTasks` array, where `i` is the iteration

 11. Iterate through `unusedTasks` 24 times
      - Find random item in `unsusedTasks` array
      - Find the DOM element with the id `"span" + (i + 1)` where `i` is the current iteration (starting with 0).
         - *Example: On the first iteration, the matching DOM element would have the `id` of `span1`.*
      - Set the `innerText` of the found `span` element to `unusuedTasks[r].task` where `r` is the random value pulled at the beginning of the iteration
      - Push `unusuedTasks[r]` to the `usedTasks` array
      - Remove `unusedTasks[r]` from the `unusedTasks` array


 12. Create local `cardTask` object to push through the `bingoTasks` array (repeat 24 times)
      - Set `cardTask[i].Task` to `usedTasks[i].task` where `i` is the current iteration starting with 0
      - Set `cardTask[i].Position` to `"span" + (i + 1)` where i is the current iteration starting 0 (this will match the `id` of the `span` element where the task appears on the card)
      - Set `cardTask[i].Completed` to `false`
      - Set `cardTask[i].Id` to `usedTasks[i].id`
      - Push new `cardTask` object to `bingoTasks` array

 13. Update `gameID` to new randomized value

 14. Update the global `card` object

 15. Perform the `updateCard()` function (detailed description of function upcoming) to update the global `gameCard` object

 16. Push each array in the global `gameCard` object to the global `toPlay` array