using System;
using System.Collections.Generic;
using System.IO;
using Emby.AdminBuddy.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Drawing;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;

namespace Emby.AdminBuddy
{
    public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages, IHasThumbImage
    {
        public static Plugin Instance { get; set; }

        //You will need to generate a new GUID and paste it here - Tools => Create GUID
        private Guid _id = new Guid("49D2A5FB-7662-46A5-A453-E144D0FCECAB");

        public override string Name => "Admin Buddy";

        public override string Description => "Create User Profiles with Ease";

        public override Guid Id => _id;

        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) : base(applicationPaths,
            xmlSerializer)
        {
            Instance = this;
        }
        public ImageFormat ThumbImageFormat => ImageFormat.Jpg;

        //Display Thumbnail image for Plugin Catalogue  - you will need to change build action for thumb.jpg to embedded Resource
        public Stream GetThumbImage()
        {
            Type type = GetType();
            return type.Assembly.GetManifestResourceStream(type.Namespace + ".thumb.jpg");
        }

        //Web pages for Server UI configuration
        public IEnumerable<PluginPageInfo> GetPages() => new[]
        {

            new PluginPageInfo
            {
                //html File
                Name = "AdminBuddyConfigurationPage",
                EmbeddedResourcePath = GetType().Namespace + ".Configuration.AdminBuddyConfigurationPage.html",
                EnableInMainMenu = true,
                DisplayName = "AdminBuddy",
                MenuSection = "server",
                //MenuIcon = "theaters"
            },
            new PluginPageInfo
            {
                //javascript file
                Name = "AdminBuddyConfigurationPageJS",
                EmbeddedResourcePath = GetType().Namespace + ".Configuration.AdminBuddyConfigurationPage.js"
            },
            new PluginPageInfo
            {
                //html File
                Name = "AdminCopyUserConfigurationPage",
                EmbeddedResourcePath = GetType().Namespace + ".Configuration.AdminCopyUserConfigurationPage.html",
            },
            new PluginPageInfo
            {
                //javascript file
                Name = "AdminCopyUserConfigurationPageJS",
                EmbeddedResourcePath = GetType().Namespace + ".Configuration.AdminCopyUserConfigurationPage.js"
            },
        };





    }
}
