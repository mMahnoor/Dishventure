const container = document.getElementById("food-items-section")

const handleSearch = () => {
    const inputValue = document.getElementById("search-box").value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        displayFoodItems(data.meals);
    })
    .catch((err) => {
        console.log(err);
    });
}

const handleDetails = (id) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
        console.log("dat:", data);
        displayFoodDetail(data.meals);
    })
    .catch((err) => {
        console.log(err);
    });
}

const displayFoodItems = (items) => {
    container.innerHTML="";
    const div = document.createElement("div");
    div.id = "items-div"
    div.classList.add("row");
    items ? items.forEach((item) => {
        console.log(item)
        const divs = document.createElement("div");
        divs.classList.add("col");
        divs.innerHTML = 
            `
                <div class="card card-shadow m-2" style="width: 18rem;" data-bs-theme="dark">
                    <img src="${item.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body d-flex justify-content-between">
                        <h5 class="card-title">${item.strMeal}</h5>
                        <button class="btn btn-outline-info" onclick="handleDetails('${item.idMeal}')">Details</button>
                    </div>
                </div>
            `;
        div.appendChild(divs);
    })
    :    
    div.innerHTML = `
        <div class="card card-shadow">
            <div class="card-body d-flex justify-content-center align-items-center">
                <h5> No items found! </h5>
            </div>
        </div>
    `
    ;
    container.appendChild(div);
}

const displayFoodDetail = (data) => {    
    const modal = document.getElementById("modal-div");
    const modal_content = document.getElementById("custom-modal-content");
    const measureList = measures(data[0]);

    modal_content.innerHTML=
    `
        <div class="modal-content">
            <div class="modal-header card p-1">
                <img src="${data[0].strMealThumb}" class="card-img" style="height:150px;" alt="...">
                <div class="card-img-overlay d-flex justify-content-between">
                    <h5 class="modal-title bg-white p-2 rounded" style="height:50px">${data[0].strMeal}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            <div class="modal-body">
                <h5>Ingrdients: </h5>
                <ol class="list-group list-group-numbered">
                    ${ingredients(data[0]).map((item, id) => `
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                            <div class="ms-2 me-auto">
                            <div class="fw-bold">${item}</div>
                            ${measureList[id]}
                            </div>
                        </li>`).join("")}
                </ol>
                <hr>
                <h5>Instructions: </h5>
                <p>${data[0].strInstructions}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    `
    let modal_div = new bootstrap.Modal(modal);
    modal_div.show();
}

// retrieval of ingredients for a food item
const ingredients = (data) => {
    let ingredientList = [];
    let i=1;
    while(i<21) {
        let compKey = "strIngredient"+i;
        if(data[compKey] && data[compKey]!="")
        {
            ingredientList.push(data[compKey]);
            console.log(i);
        }
        i = i+1;
    }
    return ingredientList;
}
// retrieval of corresponding ingredient measures for a food item
const measures = (data) => {
    let measurementList = [];
    let i=1;
    while(i<21) {
        let compKey = "strMeasure"+i;
        if(data[compKey] && data[compKey]!="")
        {
            measurementList.push(data[compKey])
        }
        i++;
    }
    return measurementList;
}