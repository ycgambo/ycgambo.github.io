cur_time=$(date '+%Y/%m/%d %H:%M:%S')

hexo g; hexo d;
git add -A; git commit -a -m "$cur_time"; git push;
