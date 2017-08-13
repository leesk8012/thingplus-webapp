#!/bin/sh

case "$1" in 
start)
  node ./server/server.js &
  node ./ui-server/ui_server.js &
  ;;
stop)
  kill $(ps aux |awk '/server.js/ {print $2}')
  kill $(ps aux |awk '/ui_server.js/ {print $2}')
  ;;
restart)
  $0 stop
  $0 start
  ;;
#status)
#  if [ -e /var/run/hit.pid ]; then
#     echo hit.sh is running, pid=`cat /var/run/hit.pid`
#  else
#     echo hit.sh is NOT running
#     exit 1
#  fi
#  ;;
*)
  echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 

