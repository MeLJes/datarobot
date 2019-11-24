async function getData() {
  const response = await fetch('https://api.jsonbin.io/b/5dd7cefb040d843991f7183c');
  const data = await response.json();

  // --- Dropdown
  const dropdown = document.getElementById('dropdown-items');
  const dropdownActive = document.getElementById('active-item');
  const departments = Object.keys(data.departments).map(i => data.departments[i]).sort(function (a, b) {
    return a.name[0].localeCompare(b.name[0]);
  });
  console.log(departments);

  let departmentsData = `
    <li class="dropdown-item" data-department-id="0">
      All departments
    </li>`;
  departmentsData += departments.map(function (item) {
    return `<li class="dropdown-item" data-department-id="${item.id}">
				${item.name}
			</li>`;
  }).join('');

  dropdown.innerHTML = departmentsData;

  // --- Dropdown element click
  Array.from(document.getElementsByClassName('dropdown-item')).forEach(item => {
    item.addEventListener('click', () => {
      dropdownActive.innerHTML = item.innerHTML;
      dropdownActive.dataset.departmentId = item.dataset.departmentId;
      document.getElementById('dropdown-items').classList.remove('active');
    });
  });

  // --- Jobs render
  const positions = document.getElementById('positions');
  const jobs = Object.keys(data.jobs).map(i => data.jobs[i]).sort(function (a, b) {
    return a.title[0].localeCompare(b.title[0]);
  });

  function updateDepartmentName(data, id) {
    let itemName = data.find(function (item) {
      if (item.id === id) {
        return item.name;
      }
    });

    /*var getFilm = films.find(function (film) {
      return film.id === filmId;
    });*/

    return itemName.name;
  }

  let jobsDepartmentsUpdate = jobs.map(function (item) {
    // console.log('in let');
    // let test = updateDepartmentName(departments, item.departments[0]);
    item.departmentName = updateDepartmentName(departments, item.departments[0]);
    // console.log(test);
    // item.departmentName =
    // item.departmentName = 'test';
    /*console.log('item department');
    console.log(item.departments[0]);
    console.log(item.departmentName);
    console.log(item);
    console.log(departments);*/

    // let departmentIdToName = ;
    // console.log('here');
    // console.log(updateDepartmentName(departments, item.departments[0]));

    console.log(item);
  });

  let jobsData = jobs.map(function (item) {
    return `
      <div class="item" data-item-number="" data-item-department="${item.departments}">
        <h2 data-position="${item.title}">
          <a href="${item.absolute_url}">${item.title}</a>
        </h2>

        <div class="info">
          <div class="city" data-item-city="${item.location.name}">
            <div class="media-holder">
              <img src="icons/city.svg" alt="DataRobot" />
            </div><!-- .media-holder -->

            ${item.location.name}
          </div><!-- .city -->

          <div class="department" data-item-department="${item.departments}">
            <div class="media-holder">
              <img src="icons/department.svg" alt="DataRobot" />
            </div><!-- .media-holder -->

            ${item.departmentName}
          </div><!-- .place -->
        </div><!-- .info -->

        <a href="${item.absolute_url}" class="more">
          Learn more

          <img src="icons/more.svg" alt="DataRobot" />
        </a><!-- .more -->
      </div><!-- .item -->`;
  }).join('');

  positions.innerHTML = jobsData;
}
getData();


(function () {
  // --- Helper functions
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // --- Main
  document.addEventListener('DOMContentLoaded', () => {
    // --- Dropdown
    document.getElementById('active-item').addEventListener('click', () => {
      // --- Open dropdown
      document.getElementById('dropdown-items').classList.toggle('active');
    });
  });

  // --- Events
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  });
  // window.addEventListener('scroll', funcName);
  // window.addEventListener('resize', funcName);
})();
