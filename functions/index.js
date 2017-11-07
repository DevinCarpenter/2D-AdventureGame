const functions = require('firebase-functions');
const admin = require('firebase-admin'); //Gets the package firebase admin
const timsort = require('timsort');
var values = require('object.values');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////     EVENT TRIGGERS      ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateUserBestScore = functions.database.ref('users/{uid}/score/{sid}').onWrite(event =>{
  
  const scoreData = event.data.val(); // Gets the data from the triggered function
  const uid = event.params.uid; // Gets the User ID that triggered this function
  const sid = event.params.sid; // Gets the Score ID that triggered this function
  // const username = admin.database().ref(`users/${uid}/uName`).then((snapshot) => {
  //   return snapshot.val();
  // });
  return admin.database().ref(`users/${uid}`).once("value").then((snapshot) => {
    //Gets the current users best score from the DB
    return snapshot.val();
  }).then((userData) => {
    var currentBestScore = userData.uBestScore;
    var username = userData.uName;
    //Takes the best score and compares it to the score that was written to the DB, and if
    //the newly written score is bigger it will overwrite the current best score.
    if(currentBestScore){ //previous score written
      if(currentBestScore < scoreData){
        //console.log("Updating score data to ", scoreData);
        admin.database().ref(`users/${uid}/uBestScore`).set(scoreData).then(() => { //new best score was written for the user
            //TODO: Since a new best score was written for the user, check if it is
            //greater than the 100th score on the leaderboard ( if there is at least 100 scores),
            //and if it is then check if the username is already on the leaderboard. If the username
            //is on the leaderboard, check if it is greater than that score, and if not then don't write it, but
            //if the username is not on the leaderboard, check if it is greater than the next greatest score.

            //TODO: Keep the lowest number on the leaderboards in the DB so there doesn't need to be a transaction
            //to check the leaderboards when we can just check to see if the users score is greater than the lowest
            //score

            //Transaction declaration that checks to see if the leaderboard needs to be updated since the current
            //user has bested their last score
            admin.database().ref(`leaderboard`).transaction( leaderboardUpdater,leaderboardUpdateComplete);

            //Function that updates the leaderboard data through a transaction
            function leaderboardUpdater(leaderboardData){
                if(leaderboardData===null) return leaderboardData; //returns transaction data if data is null
                var leaderboardLength = Object.keys(leaderboardData).length;
                console.log(`leaderboardLength is ${leaderboardLength}`);
                var savedIndex=null;
                if(leaderboardLength > 1){ //Check if at least one record on leaderboards
                    Object.keys(leaderboardData).some(function(key, index) {
                        console.log(key, leaderboardData[key]);
                        if(key === uid){ //Check if the current key matches the users uid
                            // if(parseInt(leaderboardData[key]) < scoreData){ //Check if the users old score is less than the users new score
                            //     savedIndex = index;
                            //     console.log(100);
                            //     return true;
                            // }else{
                            //     //Quit out. Users old score is greater and can't be on leaderboards twice
                            //     console.log(200);
                            //     return true;
                            // }
                            console.log(200);
                            savedIndex = index;
                            return true;
                        }else{ //current key is not the uid
                            console.log("index is ", index);
                            if(index+1 === leaderboardLength && leaderboardLength < 100){
                                savedIndex = index; //users score is not on the leaderboard and there are less than 100 users on the leaderboard
                                console.log(300);
                            }else if(parseInt(leaderboardData[key]) < scoreData){ //Check if the current leaderboard score is less than the users new score
                                if(savedIndex===null) { //saves the highest index the users score was above
                                    savedIndex = index; //users score is higher than this index
                                    console.log(400);
                                }else{
                                    console.log(500);
                                }
                            }else{
                                //Do nothing but continue on
                                console.log(600);
                            }
                        }
                    });
                    if(savedIndex !== null){ //This index is the one the new score will replace
                        console.log(`Adding ${uid} to the leaderboard`);
                        leaderboardData[uid] = {score: scoreData, username: username}; //Assign the leaderboard data to be the new score
                        let sortedDataObject = leaderboardSort(leaderboardData); //Sorts and trims all the leaderboard data
                        leaderboardData = sortedDataObject.sortedObject; //Gets the sorted object to return back to transaction
                        let generatedHTML = leaderboardHTMLGenerator(sortedDataObject); //Generates the HTML for the clientside leaderboards
                        leaderboardHTMLWriter(generatedHTML);
                        return leaderboardData;
                    }else{
                        //Return to transaction. User's score isn't high enough
                        console.log("Saved index is ", savedIndex);
                        console.log(700);
                        return leaderboardData;
                    }
                }else{ //If no leaderboard data
                    //Add that user as first on leaderboards
                    Object.keys(leaderboardData)[0] = scoreData;
                }
            }
            //Function that runs once the leaderboard has been successfully updated
            function leaderboardUpdateComplete(error, committed, snapshot){
                if (error) { //error thrown
                  throw new Error(error);
                } else if (!committed) { //transaction aborted
                  console.log(`Leaderboard transaction for ${uid} aborted!`);
                } else { //transaction completed successfully
                    console.log(`Leaderboard updated successfully!`);
                }
            }

            //A leaderboard bubblesort function that sorts the leaderboard and takes off the lowest score
            //if there are more than 100 unique users on the scoreboard, otherwise just returns the leaderboard data
            //in an object of arrays. First array place is the highest score.
            function leaderboardSort(numberObject) {
              var logCount = Object.keys(numberObject).length;
              var sortedArray = {}, sortedValueArray = [], sortedKeyArray = [], sortedUsernameArray = [];
              for(var data in numberObject){
                //console.log(numbers[data].score);
                sortedValueArray.push(numberObject[data].score);
                sortedKeyArray.push(data);
                sortedUsernameArray.push(numberObject[data].username);
              }
              //console.log("Array: ",sortedValueArray);
              var swapped;
              do {
                swapped = false;
                for (var i = 0; i < logCount - 1; i++) {
                  //console.log(sortedValueArray[i]);
                  //implements a bubble sort algorithm to sort the timelogs chronologically
                  if (sortedValueArray[i] < sortedValueArray[i+1]) {
                    //console.log(`Log ${i} was swapped with ${i+1}`);
                    var tempValue = sortedValueArray[i];
                    var tempKey = sortedKeyArray[i];
                    var tempUser = sortedUsernameArray[i];
                    sortedValueArray[i] = sortedValueArray[i + 1];
                    sortedKeyArray[i] = sortedKeyArray[i + 1];
                    sortedUsernameArray[i] = sortedUsernameArray[i + 1];
                    sortedValueArray[i + 1] = tempValue;
                    sortedKeyArray[i + 1] = tempKey;
                    sortedUsernameArray[i + 1] = tempUser;
                    swapped = true;
                  }
                }
              } while (swapped);
              //console.log("sorted array, ", sortedValueArray);
              sortedValueArray.splice(5);
              sortedKeyArray.splice(5);
              sortedUsernameArray.splice(5);
              sortedKeyArray.forEach((key, idx) => sortedArray[key] = {score: sortedValueArray[idx], username: sortedUsernameArray[idx]});
              return {
                sortedObject: sortedArray,
                sortedValues: sortedValueArray,
                sortedKeys: sortedKeyArray,
                sortedUsers: sortedUsernameArray
              };
            }
            // function getKeysUsernames(keysArray){
            //     var usernameArray
            //     keysArray.forEach((var key in keysArray) => {
            //         admin.database().ref(`users/${uid}/uname`).
            //     });
            // }

            //Function that takes the data sorted from the leaderboard and generates HTML from it for
            //use on the clientside
            function leaderboardHTMLGenerator(sortedDataObject){
                //TODO: For each key and value, add the parsed pair into HTML and the HTML into a numbered
                //list
                var htmlObject = {
                    individualScoresHTML: {},
                    scoreHTML: ""
                };
                var tempUsernameContainer = "";
                var tempScoreContainer = "";
                sortedDataObject.sortedKeys.forEach((key, index) => {
                    if(index === 0){
                        // htmlObject.scoreHTML = `<div id="leaderboard-username-container"></div>
                        //                         <div id="leaderboard-score-container"></div>`;
                        tempUsernameContainer = '<div id="leaderboard-username-container">';
                        tempScoreContainer = '<div id="leaderboard-score-container">';
                    }
                    htmlObject.individualScoresHTML[index] = `<h4 style="width: 100%">${index+1}.  ${sortedDataObject.sortedUsers[index]} : <span class="leaderboard-score">${sortedDataObject.sortedValues[index]}</span></h4>`;
                    //htmlObject.scoreHTML += `<h4 style="width: 100%">${key} : <span class="leaderboard-score">${sortedDataObject.sortedValues[index]}</span></h4>`;
                    tempUsernameContainer += `<h4 style="width: 100%" class="leaderboard-username">${index+1}.  ${sortedDataObject.sortedUsers[index]}</h4>`;
                    tempScoreContainer += `<h4 style="width: 100%" class="leaderboard-score">${sortedDataObject.sortedValues[index]}</h4>`;
                });
                htmlObject.scoreHTML = tempUsernameContainer + "</div>" + tempScoreContainer + "</div>";
                return htmlObject;
            }
            //Function that takes the HTML data generated for the leaderboard and writes it to the DB location
            function leaderboardHTMLWriter(HTMLdata){
                admin.database().ref(`leaderboardHTML`).set(HTMLdata);
            }
        });
      }
    }else{ //there is no score written
      if(scoreData){
        //console.log("Setting score data to ", scoreData);
        admin.database().ref(`users/${uid}/uBestScore`).set(scoreData);
      }
    }
    return currentBestScore;
  }).then(() => {
    //TODO: Each time the user score is written to the db, take the score and divide it by 60,
    // then that will increment each second that is played to create the user time played.
    return admin.database().ref(`users/${uid}/uTimeSecondsPlayed`).once("value").then((snapshot) => {
        var uTimeSecondsPlayed = snapshot.val();
        if(uTimeSecondsPlayed) uTimeSecondsPlayed += scoreData/60;
        else{ uTimeSecondsPlayed = scoreData/60; }
        admin.database().ref(`users/${uid}/uTimeSecondsPlayed`).set(uTimeSecondsPlayed).catch(
            (error) => {console.log(`There was an error with setting the uTimeSecondsPlayed! Error: ${error}`);}
        );
    });
  }).catch((err) => {
    console.log("Uh-oh! An error has occurred! ",err);
  });
});


