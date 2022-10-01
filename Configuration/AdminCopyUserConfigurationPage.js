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
                },
                {
                    href: Dashboard.getConfigurationPageUrl('AdminCopyUserConfigurationPage'),
                    name: 'Copy-Users'
                }
            ];
        }

        //GetUsers
        async function getUsers() {
            return await ApiClient.getJSON(ApiClient.getUrl('Users'));
        }

        async function getUser(id) {
            return await ApiClient.getJSON(ApiClient.getUrl('Users/' + id));
        }

        async function getUserDto(id) {
            await getUser(id)
                .then(copyUserPolicy)
                .catch((error) => {
                    console.log('ERROR: ', error);
                });
        }

        let userInfo;
        let userConfig;
        let userPolicy;
        async function copyUserPolicy(data) {
            userInfo = data;
            userConfig = data.Configuration;
            userPolicy = data.Policy;
            console.log('Users full data: ', userInfo);
            console.log('User Config data: ', userConfig);
            console.log('User Policy data: ', userPolicy);

            if (userPolicy.IsAdministrator) {
                await createNewUserFromExisting();
            } else {
                alert("YOU DO NOT HAVE ADMIN RIGHTS");
            }
        }

        async function createNewUserFromExisting() {
            console.log("Copying data from Existing User to new User");



        };

        function getListItemHtml(user, padding) {
            var html = '';
            html +=
                '<div class="virtualScrollItem listItem listItem-border focusable listItemCursor listItem-hoverable listItem-withContentWrapper" tabindex="0" draggable="false" style="transform: translate(0px, ' +
                padding +
                'px);">';
            html += '<div class="listItem-content listItemContent-touchzoom">';
            html += '<div class="listItemBody itemAction listItemBody-noleftpadding">';
            html += '<div class="listItemBodyText listItemBodyText-nowrap">' + user.Name + '</div>';
            html +=
                '<div class="listItemBodyText listItemBodyText-secondary listItemBodyText-nowrap">Intro Auto Skip enabled for this account.</div>';
            html += '</div>';
            html +=
                '<button title="Remove" aria-label="Remove" type="button" is="paper-icon-button-light" class="listItemButton itemAction paper-icon-button-light icon-button-conditionalfocuscolor removeItemBtn" id="' +
                user.Id +
                '">';
            html += '<i class="md-icon removeItemBtn" style="pointer-events: none;">delete</i>';
            html += '</button> ';
            html += '</div>';
            html += '</div>';
            return html;
        }

        function handleRemoveItemClick(e, element, view) {
            var id = e.target.closest('button').id;
            ApiClient.getPluginConfiguration(pluginId).then((config) => {
                var filteredList = config.AutoSkipUsers.filter(userId => userId != id);
                config.AutoSkipUsers = filteredList;
                ApiClient.updatePluginConfiguration(pluginId, config).then((r) => {
                    reloadList(filteredList, element, view);
                    loadUsersSelect(config, view);
                    Dashboard.processPluginConfigurationUpdateResult(r);
                });
            });
        }

        /*function reloadList(element, view) {
            element.innerHTML = '';
            if (list && list.length) {
                var padding = 0;
                list.forEach(async item => {
                    var user = await getUser(item);
                    element.innerHTML += getListItemHtml(user, padding);
                    padding += 77; //Why is this padding necessary
                    var removeButtons = view.querySelectorAll('.removeItemBtn');
                    removeButtons.forEach(btn => {
                        btn.addEventListener('click',
                            el => {
                                el.preventDefault();
                                handleRemoveItemClick(el, element, view);
                            });
                    });

                });
            }
        }*/

        function loadUsersSelect(config, view) {
            var usersSelect = view.querySelector('#selectEmbyUsers');
            usersSelect.innerHTML = '';
            getUsers().then(users => {
                for (let i = 0; i <= users.length - 1; i++) {
                    /*if (config.AutoSkipUsers.includes(users[i].Id)) {
                        continue;
                    }*/
                    usersSelect.innerHTML += '<option value="' + users[i].Id + '">' + users[i].Name + '</option>';
                }
            });
        }
        
        return function(view) {
            view.addEventListener('viewshow',
                async () => {

                    loading.show();
                    mainTabsManager.setTabs(this, 1, getTabs);

                    var config = await ApiClient.getPluginConfiguration(pluginId);

                    var userList = view.querySelector('.user-list');
                    var userSelect = view.querySelector('#selectEmbyUsers');
                    var copyUserProfile = view.querySelector('#btnAddUserToAutoSkipList');

                    loadUsersSelect(config, view);

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
    