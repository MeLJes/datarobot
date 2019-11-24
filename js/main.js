async function getData() {
  const response = await fetch('https://api.jsonbin.io/b/5dd7cefb040d843991f7183c');
  const data = await response.json();

  // --- Dropdown
  const dropdown = document.getElementById('dropdown-items');
  const dropdownActive = document.getElementById('active-item');
  const departments = Object.keys(data.departments).map(i => data.departments[i]).sort(function (a, b) {
    return a.name[0].localeCompare(b.name[0]);
  });

  let departmentsData = `
    <li class="dropdown-item" data-department-id="all">
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

      _positionsRender(item.dataset.departmentId);

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

    return itemName.name;
  }

  jobs.map(function (item) {
    item.departmentName = updateDepartmentName(departments, item.departments[0]);
  });

  function _positionsRender(departmentId) {
    if (dropdownActive.dataset.departmentId === 'all') {
      positions.classList.remove('loaded');

      setTimeout(function () {
        positions.innerHTML = jobs.map(function (item) {
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
      }, 250);

      setTimeout(function () {
        positions.classList.add('loaded');
      }, 325);
    } else {
      let loopCheck = 0;
      let jobsCounter = jobs.reduce(function (jobsCounter, item) {
        jobsCounter[item.departments[0]] ? jobsCounter[item.departments[0]]++ : jobsCounter[item.departments[0]] = 1;

        return jobsCounter;
      }, {});
      let jobsCheck = Object.keys(jobsCounter).forEach(function(item) {
        if (item === departmentId) {
          loopCheck = 1;
        }
      });


      if (loopCheck === 1) {
        positions.classList.remove('loaded');

        setTimeout(function () {
          let jobsFiltered = jobs.filter(function (item) {
            return item.departments == parseInt(departmentId);
          });

          positions.innerHTML = jobsFiltered.map(function (item) {
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
        }, 250);

        setTimeout(function () {
          positions.classList.add('loaded');
        }, 325);
      } else {
        positions.classList.remove('loaded');

        setTimeout(function () {
          positions.innerHTML = `<h2 class="empty">There is no open positions for this category</h2>`
        }, 250);

        setTimeout(function () {
          positions.classList.add('loaded');
        }, 325);
      }
    }
  }
  _positionsRender();
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
})();
