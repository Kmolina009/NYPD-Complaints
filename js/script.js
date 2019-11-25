/********** Constants and Variables ************/

/********** INPUT ************/
$(function(){

    const URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?agency=NYPD&";
    let response, limit, borough, complaints, list, endpoint;


    /********** Cached Element References ************/
    const $inputEl = $('input');
    const $complaintsList = $('.complaints-list');


    /********** Event Listeners ************/
    $('.controls').on('click', 'button', handleClick);
    $('.complaints-list').on('click', 'button', handleReveal);


    /********** Functions ************/

    /********** PROCESS ************/
    function handleReveal() {
        $(this).parent().siblings('p').toggleClass('hidden');
    }

    function handleClick() {
        borough = this.dataset.id;
        limit = $inputEl.val() || 10;
        getData()
    }

    function getData() {
        if(!borough) return;

        endpoint = URL + `borough=${borough}`;

        response = $.ajax({ url: endpoint, data: {
                "$limit": limit
            }
        });
        
        response.then(
            function(dataArr) {
                complaints = dataArr;
                render();
            }, 
            function(error) {
                M.toast({html: 'Something Went Wrong - Try Again'});
            }
        );
    }

    function getComplaintsUI(data) {

        const title = data.descriptor === 'No Access' || data.descriptor === 'Partial Access'
        ? 'Limited Information Available'
        : data.descriptor;

        const description = data.resolution_description === undefined
        ? 'No Data Available'
        : data.resolution_description;

        return`
            <section class="complaint-desc">
                <div class="details">
                    <h5>🚨 ${title}</h5>
                    <button class="btn btn-small red">What did the police do?</button>
                </div>
                <p class="hidden">${description}</p>
            </section>`;
    }

    /********** OUTPUT ************/

    function render() {
        if(complaints.length) {
            list = complaints.map(function(complaint) {
                return getComplaintsUI(complaint);
            }).join("");
            $complaintsList.html(list);
        }
    }
})