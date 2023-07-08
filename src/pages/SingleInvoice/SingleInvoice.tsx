import React, { FC } from 'react';
import { Condition, withAuthorization } from '../../contexts/Session';
import { Card } from '@blueprintjs/core';

const SingleInvoice: FC = () => {
  return (
    <Card>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et velit in augue pulvinar suscipit. Ut nunc sem,
        volutpat nec mollis vitae, rutrum quis ipsum. In a sodales tellus, at dignissim leo. Morbi risus metus,
        scelerisque id erat quis, ullamcorper varius massa. Integer eleifend lorem sed ipsum maximus commodo.
        Pellentesque rhoncus pharetra mattis. Proin tempor libero est, et vestibulum est tempor quis. Ut cursus accumsan
        vestibulum. Aliquam erat volutpat. Mauris lorem massa, lobortis a pharetra molestie, sollicitudin ac eros. Ut
        velit ligula, vulputate non quam eget, ullamcorper consequat nibh. Nam eget volutpat massa. Fusce at est in erat
        suscipit egestas sit amet vel felis. Nam est orci, viverra vel finibus ut, dapibus sed diam. Vestibulum lacinia
        massa sit amet nisi tincidunt, eu suscipit sem egestas. Cras feugiat ex sed elementum iaculis. Nunc sed tellus
        hendrerit, maximus mi at, iaculis augue. Cras ac luctus sem, quis laoreet ante. Vestibulum ante ipsum primis in
        faucibus orci luctus et ultrices posuere cubilia curae; Nullam dignissim risus id mauris venenatis, non volutpat
        dui pharetra. In hac habitasse platea dictumst. Nulla nec faucibus velit, quis facilisis massa. In nec neque et
        dui pretium consectetur quis quis risus. Mauris convallis fermentum mi, quis vulputate mi volutpat nec.
        Vestibulum dignissim mauris cursus fringilla eleifend. Integer vulputate finibus urna, ac dignissim quam
        scelerisque sit amet. Quisque quis justo pulvinar, euismod nisl vel, porttitor risus. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Praesent semper sem id justo facilisis, non faucibus ex ornare.
        Pellentesque elit felis, malesuada id lorem nec, sollicitudin scelerisque turpis. Nam scelerisque lectus sapien,
        id suscipit nisi ornare ut. Etiam et sem et nibh cursus malesuada at sed augue. Sed feugiat viverra mauris sit
        amet malesuada. Curabitur sit amet iaculis libero, sit amet imperdiet metus. Fusce quis iaculis sem. Cras
        hendrerit nulla at lobortis scelerisque. Morbi eget neque magna. Praesent mattis, dolor in fringilla consequat,
        mauris est sollicitudin lectus, sed fringilla mauris erat et nulla. Phasellus molestie risus nibh, ac mollis dui
        dignissim at. Nulla suscipit eu lectus non auctor. Donec a nisl facilisis ante suscipit pulvinar eget nec
        tortor. Fusce ut mauris purus. Proin pellentesque fermentum ipsum, vel semper odio. Quisque nec odio massa.
        Integer condimentum fringilla quam nec condimentum. Aenean libero dui, sollicitudin ut volutpat a, sollicitudin
        vel sapien. Nunc vel libero purus. Aliquam vulputate placerat eros, quis accumsan nisl maximus nec. Nulla
        suscipit ultricies laoreet. Nam sit amet scelerisque quam. In non odio erat. Morbi in aliquam enim. Nulla
        eleifend nisi justo. Nunc ut posuere sapien, vitae pulvinar ante. Cras rhoncus ex faucibus erat interdum, in
        rhoncus sem molestie. Quisque et gravida dui. Ut a orci non arcu mollis vehicula. Nulla facilisi. Nullam id
        auctor turpis.
      </div>
    </Card>
  );
};
export default withAuthorization(Condition.isAdmin)(SingleInvoice);
