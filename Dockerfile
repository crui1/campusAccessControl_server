FROM ubuntu:16.04
RUN apt-get update
# 安装网络工具 网卡信息工具
RUN apt-get -y install iputils-ping iproute2 
CMD ["bash"]