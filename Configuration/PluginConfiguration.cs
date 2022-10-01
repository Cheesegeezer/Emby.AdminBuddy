using MediaBrowser.Model.Plugins;

namespace Emby.AdminBuddy.Configuration
{
    public class PluginConfiguration : BasePluginConfiguration
    {
        //User Configuration Files
        public bool EnableAdminBuddy { get; set; }


        public PluginConfiguration()
        {
            //add default values here to use
            EnableAdminBuddy = true;

        }
    }
}
