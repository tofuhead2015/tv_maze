"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");





/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  try{
    const shows = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
    console.log(shows.data)
    return shows.data
  } catch (e){
    alert("Error: " + e)
  }
  return []
  

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  if (!shows.length) return

  for (let show of shows) {
    const img = show.show.image
    let img_src = 'img_not_available.jpg'
    if (img) img_src = img.medium
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
          <div class="media">
            <img 
                src=${img_src}              
                class="w-25 mr-3">
            <div class="media-body">
              <h5 class="text-primary">${show.show.name}</h5>
              <div><small>${show.show.summary}</small></div>
                <button type="button" class="btn btn-primary Show-getEpisodes" 
                data-toggle="modal" data-target="#myModal">   
                Episodes               
                </button>
                <!-- Modal -->
                <div class="modal fade" id="myModal" role="dialog">
                  <div class="modal-dialog">                  
                    <!-- Modal content-->
                    <div class="modal-content">                      
                      <div class="modal-body">
                        <p>Some text in the modal.</p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>                   
                  </div>
                </div>
              </div>
          </div>
        </div>                   
      `);
    $showsList.append($show);   
  }
  const $showEpisodes = $(".Show-getEpisodes")  // Show-getEpisodes
    
    $showEpisodes.on('click', async function (e){
      console.log('show episodes clicked')      
      const show_id = e.target.parentElement.parentElement.parentElement.getAttribute('data-show-id')
      console.log(show_id)
      const episodes = await getEpisodesOfShow(show_id)
      populateEpisodes(episodes)
  }) 
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();  
  console.log(term)
  const shows = await getShowsByTerm(term);
  
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  try{
    const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
    console.log(episodes)
    return episodes.data
  } catch (e){
    alert("Error: " + e)
  }
  return []
 }

/** Write a clear docstring for this function... */

async function populateEpisodes(episodes) {  
  $('.modal-body').empty()
  console.log("Populating episodes ", episodes.length)
  for (let episode of episodes){
    let p = document.createElement('p')
    p.innerText = episode.name
    $('.modal-body').append(p)    
  }  
}
