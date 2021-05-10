// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  // console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  // console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre

  //create a new object and hold the movies data
  let moviesToReturn = {}

  //start with an empty array
  moviesToReturn.movies = []
  
  if (year == undefined || genre == undefined || year == ``|| genre==``) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope! Please define the genre and year!` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      
      //store each movie in memory
      let movie = moviesFromCsv[i]

      // set condition if movie fits the required parameters requested by the user
      if (movie.startYear == year && movie.genres.includes(genre)){

        //create an object that includes the title, the year and teh movie's genres
        let movieDetails = {
          title: movie.primaryTitle,
          year: movie.startYear,
          genres: movie.genres
        }
        
        //Add a condition to only push when there's no genre and when there's no runtime minutes
        if (movie.genres != '\\N' && movie.runtimeMinutes != `\\N`) {

          //add the movie to the list to push
          moviesToReturn.movies.push(movieDetails)
      }
        console.log(movieDetails)
      }

    //add the number of movies to the returned object count
    moviesToReturn.numResults = moviesToReturn.movies.length

    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(moviesToReturn) // a string of data
    }
  }
}