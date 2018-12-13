# ################################################################################
# ### VARIABLES ##################################################################
# ################################################################################
$apache_path = '/var/www/html/kopya'

# ################################################################################
# ### INIT #######################################################################
# ################################################################################

class {'abes':
  appli_name => 'kopyaFront',
  env        => 'DEV',
  group_id   => 'fr.abes.kopya',
}

# ################################################################################
# ### WEB ########################################################################
# ################################################################################
node /^raiponce(\d)-dev/ {
  notify { "Deploy on RAIPONCE ${1} DEV": }

  abes::apache::htaccess { 'htaccess' :
    apache_path_web => $apache_path,
    file_name       => 'htaccess_kopya',
  }

  abes::apache::front { 'appli vue.js' :
    apache_path_web => $apache_path,
    artifact_id     => 'front'
  }
}

# ################################################################################
node default {
  notify { 'Aucun deploiement sur cette machine' : }
}

