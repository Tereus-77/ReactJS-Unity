//I like to separate DB instance for re-utilization
var database = db.firestore()

//Also a good practice to separate reference instance
var usersReference = database.collection("main");

//Get them
usersReference.get().then((querySnapshot) => {

    //querySnapshot is "iteratable" itself
    querySnapshot.forEach((userDoc) => {

        //userDoc contains all metadata of Firestore object, such as reference and id
        console.log(userDoc.id)

        //If you want to get doc data
        var userDocData = userDoc.data()
        console.dir(userDocData)

    })

})