export BALLERINE_ROOT=~/ballerine

alias upDeps="cd $BALLERINE_ROOT/services/workflows-service && npm run docker:db"
alias resetBallerine="cd $BALLERINE_ROOT/services/workflows-service && npm run db:reset:dev"
alias killBallerine="cd $BALLERINE_ROOT/services/workflows-service && docker-compose down -v"
alias upBackOffice="cd $BALLERINE_ROOT/apps/backoffice-v2 && npm run dev"
alias upServices="cd $BALLERINE_ROOT/services/workflows-service && npm run dev"