/*-----Custom JS Dark Mode For Feed01 ------*/
const toggleMode = document.querySelector("._layout_swithing_btn_link");
const layout = document.querySelector("._layout_main_wrapper");
let darkMode = false;

if (toggleMode && layout) {
	console.log(toggleMode);
	toggleMode.addEventListener("click", () => {
		darkMode = !darkMode;
		if (darkMode) {
			layout.classList.add("_dark_wrapper");
		} else {
			layout.classList.remove("_dark_wrapper");
		}
	});
}
/*-----Custom JS Dark Mode End For Feed01 ------*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
	// Custom Dropdown for profile
	var profileDropdown = document.querySelector("#_prfoile_drop");
	var profileDropShowBtn = document.querySelector("#_profile_drop_show_btn");
	var isDropShow = false;
	
	// Custom Dropdown for timeline
	var timelineDropdown = document.querySelector("#_timeline_drop");
	var timelineDropShowBtn = document.querySelector("#_timeline_show_drop_btn");
	var isDropTimelineShow = false;
	
	console.log("Profile dropdown:", profileDropdown);
	console.log("Profile dropdown button:", profileDropShowBtn);
	
	// Profile dropdown functionality
	if (profileDropdown && profileDropShowBtn) {
		profileDropShowBtn.addEventListener("click", function(event) {
			event.preventDefault();
			event.stopPropagation();
			isDropShow = !isDropShow;
			console.log("Profile dropdown clicked, isDropShow:", isDropShow);
			
			if (isDropShow) {
				profileDropdown.classList.add('show');
				console.log("Profile dropdown shown");
			} else {
				profileDropdown.classList.remove('show');
				console.log("Profile dropdown hidden");
			}
		});
		
		// Prevent dropdown from closing when clicking inside it
		profileDropdown.addEventListener('click', function(event) {
			event.stopPropagation();
		});
	} else {
		console.error("Profile dropdown elements not found!");
	}
	
	// Timeline dropdown functionality
	if (timelineDropdown && timelineDropShowBtn) {
		timelineDropShowBtn.addEventListener("click", function(event) {
			event.preventDefault();
			event.stopPropagation();
			isDropTimelineShow = !isDropTimelineShow;
			console.log("Timeline dropdown clicked, isDropTimelineShow:", isDropTimelineShow);
			
			if (isDropTimelineShow) {
				timelineDropdown.classList.add('show');
				console.log("Timeline dropdown shown");
			} else {
				timelineDropdown.classList.remove('show');
				console.log("Timeline dropdown hidden");
			}
		});
		
		// Prevent dropdown from closing when clicking inside it
		timelineDropdown.addEventListener('click', function(event) {
			event.stopPropagation();
		});
	}
	
	// Close dropdowns when clicking outside
	document.addEventListener('click', function(event) {
		// Close profile dropdown if clicking outside
		if (isDropShow && profileDropdown && profileDropShowBtn && 
			!profileDropdown.contains(event.target) && !profileDropShowBtn.contains(event.target)) {
			isDropShow = false;
			profileDropdown.classList.remove('show');
			console.log("Profile dropdown closed by outside click");
		}
		
		// Close timeline dropdown if clicking outside
		if (isDropTimelineShow && timelineDropdown && timelineDropShowBtn &&
			!timelineDropdown.contains(event.target) && !timelineDropShowBtn.contains(event.target)) {
			isDropTimelineShow = false;
			timelineDropdown.classList.remove('show');
			console.log("Timeline dropdown closed by outside click");
		}
	});
	
	// Close dropdowns when pressing Escape key
	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape' || event.keyCode === 27) {
			if (isDropShow && profileDropdown) {
				isDropShow = false;
				profileDropdown.classList.remove('show');
				console.log("Profile dropdown closed by Escape key");
			}
			if (isDropTimelineShow && timelineDropdown) {
				isDropTimelineShow = false;
				timelineDropdown.classList.remove('show');
				console.log("Timeline dropdown closed by Escape key");
			}
		}
	});
});
