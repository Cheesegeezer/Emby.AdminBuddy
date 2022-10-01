using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediaBrowser.Common.Net;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Library;
using MediaBrowser.Model.Logging;
using MediaBrowser.Model.Querying;
using MediaBrowser.Model.Tasks;

namespace Emby.AdminBuddy.ScheduledTasks
{
    //Use this section if you need to have Scheduled tasks run
    public class PluginScheduledTask : IScheduledTask, IConfigurableScheduledTask
    {
        private readonly ILibraryManager LibraryManager;

        private readonly ILogger _log;
        private readonly IServerApplicationHost _serverApplicationHost;
        private readonly IUserDataManager _userDataManager;
        private readonly IUserManager _userManager;
        private IHttpClient _httpClient;

        public string Name => "Admin Buddy";

        public string Key => "AdminBuddy";

        public string Description => "Run Task to Create User Profiles";

        public string Category => "Administrator Tools";

        public bool IsHidden => true;

        public bool IsEnabled => false;

        public bool IsLogged => true;

        //Constructor
        public PluginScheduledTask(ILibraryManager libraryManager, ILogManager logManager, IServerApplicationHost serverApplicationHost, IHttpClient httpClient, IUserManager userManager)
        {
            LibraryManager = libraryManager;
            _serverApplicationHost = serverApplicationHost;
            _httpClient = httpClient;
            _userManager = userManager;
            _log = logManager.GetLogger(Plugin.Instance.Name);
        }

        //progressBar fields
        private double _totalProgress;
        private int _totalItems;
        

        //Task that will execute from the SheduleTask Menu
        public Task Execute(CancellationToken cancellationToken, IProgress<double> progress)
        {
            //Do work here for your Scheduled Task
            

            return Task.CompletedTask;

        }

        //Task Triggers - Currently unset, user can set these themselves in the menu.
        public IEnumerable<TaskTriggerInfo> GetDefaultTriggers()
        {
            return new List<TaskTriggerInfo>();
        }


    }
}
