cur_time=$(date '+%Y/%m/%d %H:%M:%S')

hexo g;
git add -f *; git commit -a -m "$cur_time"; git push; hexo d;
