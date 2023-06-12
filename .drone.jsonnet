local branches = ["dev"];
local branch = std.extVar("build.branch");
local projectName = "vaults-app";
local imageName = "symbiosisfinance/%s" % projectName;

local projectEnv(branch) = (
	if branch == "dev" then
		"dev"
	else
		error "No config for branch %s" % branch
);
local nextEnv(branch) = (
	if branch == "dev" then
		"mainnet"
	else
		error "No config for branch %s" % branch
);

local imageNameWithTag(branch) = imageName + ":" + projectEnv(branch);

local projectNameWithEnv(branch) = projectName + "-" + projectEnv(branch);

local composeProjectName(branch) =
	"--project-name "+projectName+"-"+projectEnv(branch);

local dockerCompose(branch) = (
  if branch == "dev" then
    "docker-compose.dev.yml"
  else
    error "No project name for branch %s" % branch
);


local domain(branch) = (
	if branch == "dev" then
    "dev"
  else
    error "No domain for branch %s" % branch
) + ".88x.finance";

local deployNode(branch) = (
	if  branch == "dev" then
		{
			"role": "dev"
		}
  else
      error "No node for branch %s" % branch
);

[{
     "kind": "pipeline",
     "type": "docker",
     "name": "build",
     "steps": [
         {
             "name": "image",
             "image": "plugins/docker",
              "settings" : {
                 "repo": imageName,
                 "build_args": [
                     "VERSION=git-${DRONE_COMMIT_SHA:0:8}",
                     "NEXT_PUBLIC_ENVIRONMENT=%s" % nextEnv(branch)
                 ],
                 "dockerfile": "Dockerfile",
                 "auto_tag": false,
                 "insecure": false,
                 "purge": false,
                 "username": {
                   "from_secret": "docker_username"
                 },
                 "password": {
                     "from_secret": "docker_password"
                 },
                 "tags": [projectEnv(branch)]
             },
             "when": {
                 "branch": branches,
                 "event": "push"
             }
         }
     ]
},{
     "kind": "pipeline",
     "type": "docker",
     "name": "deploy",
     "steps": [
        {
             "name": "docker-compose",
             "image": "docker/compose",
             "environment": {
                    "DEPLOY_IMAGE": imageNameWithTag(branch),
                    "DEPLOY_PROJECT": projectNameWithEnv(branch),
                    "DEPLOY_DOMAIN": domain(branch),
                    "DEPLOY_PROJECT_ENV": projectEnv(branch),
                    "NEXT_PUBLIC_ENVIRONMENT": nextEnv(branch),
             },
             "commands": [
                 "docker pull symbiosisfinance/" + projectName + ":" + projectEnv(branch),
                 "docker-compose " + composeProjectName(branch) + " -f docker-compose.yml -f " + dockerCompose(branch) + " up -d",
             ],
             "volumes": [
                 {
                     "name": "dockersock",
                     "path": "/var/run/docker.sock"
                 },
                 {
                     "name": "dockerconfig",
                     "path": "/root/.docker/config.json"
                 }
             ],
             "when": {
                 "branch": branches,
                 "event": "push"
             }
        }
     ],
     "volumes": [
         {
             "name": "dockersock",
             "host": {
                 "path": "/var/run/docker.sock"
             }
         }, {
             "name": "dockerconfig",
             "host": {
                 "path": "/root/.docker/config.json"
             }
         }
     ],
     "depends_on": [
         "build"
     ],
     "node": deployNode(branch)
 }]
