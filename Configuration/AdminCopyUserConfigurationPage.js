define([
        "loading", "dialogHelper", "mainTabsManager", "formDialogStyle", "emby-checkbox", "emby-select", "emby-toggle",
        "emby-collapse"
    ],
    function(loading, dialogHelper, mainTabsManager) {

        const pluginId = "49D2A5FB-7662-46A5-A453-E144D0FCECAB";

        function getTabs() {
            return [
                {
                    href: Dashboard.getConfigurationPageUrl('AdminBuddyConfigurationPage'),
                    name: 'Create-Users'
                }
            ];
        }

        let allUsers;
        let userInfo;
        let userConfig;
        let userPolicy;
        
        async function getAllUsers() {
            let myPromise = new Promise(function (resolve) {
                resolve(ApiClient.getUsers()); 
            });
            allUsers = await myPromise;
        }

        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }

        //Create New User
        async function createNewUser(name) {
            let label = document.querySelector('#lblStatus');
            ApiClient.createUser(name);
            await delay(1000);
            await getAllUsers();
            console.log('All Users Found:', allUsers);
            
            for (let i = 0; i < allUsers.length; i++) {
                if (allUsers[i].Name === name) {
                    console.log('User Found: ', allUsers[i]);
                    //update config
                    await ApiClient.updateUserPolicy(allUsers[i].Id, userPolicy);
                    label.innerHTML = 'User Created and Policy updated';
                    console.log('User Policy Updated: ', userPolicy);
                    await delay(1000);
                    await ApiClient.updateUserConfiguration(allUsers[i].Id, userConfig);
                    label.innerHTML = 'User Created and Policy and Configuration updated';
                    console.log('User Configuration Updated: ', userConfig);
                    break;
                }
            }
        }

        function action_dlg() {
            
                var dlg = dialogHelper.createDialog({
                    removeOnClose: true,
                    size: 'small'
                });

                dlg.classList.add('ui-body-a');
                dlg.classList.add('background-theme-a');

                dlg.classList.add('formDialog');
                dlg.style.maxWidth = '35%';
                dlg.style.maxHeight = '50%';

                var html = '';
                html += '<div class="formDialogHeader">';
                html += '<button is="paper-icon-button-light" class="btnCancel autoSize" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>';
                html += `<h3 class="formDialogHeaderTitle">Create New User</h3>`;
                html += '</div>';
                html += '<div class="formDialogContent" style="margin:2em">';
                html += '<div class="dialogContentInner" style="max-width: 70%; max-height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center">';

                //Name Entry
                html += '<input is="emby-input" id="textUserName" label="Enter New User Name" autocomplete="off" style="margin-left: 45%;" />';
                html += '<br />';

                //Save
                html += '<button is="emby-button" type="button" style="margin-left:45%; margin-bottom:3em; background-color:green;" class="btnSaveUser raised button-submit block emby-button">';
                html += '<span>Save New User</span>';
                html += '</button>';

                //Cancel
                html += '<button is="emby-button" type="button" class="btnCancel raised button-cancel" style="margin-left: 45%; background-color:red;">';
                html += '<span>Close</span>';
                html += '</button>';

                html += '<br />';
                html += '<label id="lblStatus" style="margin-left: 45%;">Status</label>';


                html += '</div>';

                html += '</div>';
                html += '</div>';

                dlg.innerHTML = html;

                var btnSaveUser = dlg.querySelector(".btnSaveUser");
                var userNameTxt = dlg.querySelector("#textUserName");
                btnSaveUser.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (userNameTxt.value === "") {
                        alert('Please enter a User Name');
                    } else {
                        console.log('UserName: ', userNameTxt.value);
                        createNewUser(userNameTxt.value);
                    }
                });

                dlg.querySelectorAll('.btnCancel').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        dialogHelper.close(dlg);
                    });
                });
                dialogHelper.open(dlg);
        }
        
        //GetUsers
        async function getUsers() {
            return await ApiClient.getJSON(ApiClient.getUrl('Users'));
        }

        async function getUser(id) {
            return await ApiClient.getJSON(ApiClient.getUrl('Users/' + id));
        }

        
        let isAdmin = false;
        async function getCurrentUserId() {
            let myPromise = new Promise(function (resolve) {
                resolve(ApiClient.getCurrentUserId());
            });
            currentId = await myPromise;
            console.log("Current User Id:", currentId);
            getCurrentUserDto(currentId);

        }
        async function getCurrentUserDto(id) {
            await getUser(id)
                .then(UserPolicy)
                .catch((error) => {
                    console.log('ERROR: ', error);
                });
        }

        async function UserPolicy(data) {
            let currentUserInfo = data.Policy;
            userPolicy = data.Policy;
            console.log("IsAdmin: ", currentUserInfo.IsAdministrator);
            if (currentUserInfo.IsAdministrator === true) {
                isAdmin = true;
            }
        }

        async function getUserDto(id) {
            await getUser(id)
                .then(copyUserPolicy)
                .catch((error) => {
                    console.log('ERROR: ', error);
                });
        }

        
        
        async function copyUserPolicy(data) {

            userInfo = data;
            userConfig = data.Configuration;
            userPolicy = data.Policy;
            console.log('Users full data: ', userInfo);
            console.log('User Config data: ', userConfig);
            console.log('User Policy data: ', userPolicy);

            if (isAdmin === true) {
                await createNewUserFromExisting();
            } else {
                alert("YOU DO NOT HAVE ADMINISTRATOR RIGHTS");
            }
        }

        async function createNewUserFromExisting() {
            console.log("Copying data from Existing User to new User");
            action_dlg();
        };

        function loadUsersSelect(view) {
            var usersSelect = view.querySelector('#selectEmbyUsers');
            usersSelect.innerHTML = '';
            getUsers().then(users => {
                for (let i = 0; i <= users.length - 1; i++) {
                    if (users[i].Policy.IsAdministrator === true) {
                        usersSelect.innerHTML += '<option value="' + users[i].Id + '">' + users[i].Name + " (Admin)" + '</option>';
                    } else {
                        usersSelect.innerHTML += '<option value="' + users[i].Id + '">' + users[i].Name + '</option>';
                    }
                }
            });
        }
        
        return function(view) {
            view.addEventListener('viewshow',
                async () => {

                    loading.show();
                    mainTabsManager.setTabs(this, 0, getTabs);
                    
                    getCurrentUserId();
                    
                    var userSelect = view.querySelector('#selectEmbyUsers');
                    var copyUserProfile = view.querySelector('#btnAddUserToAutoSkipList');

                    loadUsersSelect(view);

                    loading.hide();

                    copyUserProfile.addEventListener('click',
                        (e) => {
                            e.preventDefault();
                            loading.show();

                            

                            var userId = userSelect[userSelect.selectedIndex].value;
                            console.log("UserId:", userId);

                            getUserDto(userId);

                            

                            loading.hide();
                        });
                });
        }
    });
    